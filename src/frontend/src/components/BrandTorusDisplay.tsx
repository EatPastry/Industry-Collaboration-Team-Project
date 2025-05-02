import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { getCurrentUserTransactions, getPartnerIds } from '../services/API';
import * as THREE from 'three';

interface Brand {
  name: string;
  count: number;
  savings: number;
}

//colours for each slice
const colours = ['#FF1744', '#FF9100', '#FFEA00', '#00E676', '#2979FF'];
const textcolours = ['#C51162', '#DD6C00', '#C0B900', '#00A152', '#004FC4'];


function RotatingTorus({ topBrands }: { topBrands: Brand[] }) {
  const torusRef = useRef<any>();

  // Use dynamic savings to determine slice angles
  const totalSavings = topBrands.reduce((sum, brand) => sum + brand.savings, 0);

  // Pre-calculate angles for each brand's slice using savings
  const angles: { start: number; end: number }[] = [];
  let currentAngle = 0;
  topBrands.forEach((brand) => {
    const sliceAngle = totalSavings > 0 ? (brand.savings / totalSavings) * Math.PI * 2 : 0;
    angles.push({
      start: currentAngle,
      end: currentAngle + sliceAngle
    });
    currentAngle += sliceAngle;
  });

  // Create torus segment geometry remains unchanged
  const createTorusSegment = (startAngle: number, endAngle: number) => {
    const segments = 32;
    const radius = 5;
    const tubeRadius = 1.5;
    const radialSegments = 16;
    
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / segments);
      for (let j = 0; j <= radialSegments; j++) {
        const tubeAngle = (j / radialSegments) * Math.PI * 2;
        const x = (radius + tubeRadius * Math.cos(tubeAngle)) * Math.cos(angle);
        const y = tubeRadius * Math.sin(tubeAngle);
        const z = (radius + tubeRadius * Math.cos(tubeAngle)) * Math.sin(angle);
        vertices.push(x, y, z);
      }
    }
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = a + 1;
        const c = a + (radialSegments + 1);
        const d = c + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  };

  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={torusRef}>
      {topBrands.map((brand, index) => {
        const { start, end } = angles[index];
        const color = colours[index % colours.length];
        const geometry = createTorusSegment(start, end);
        return (
          <mesh key={brand.name} geometry={geometry}>
            <meshStandardMaterial 
              color={color}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      {topBrands.map((brand, index) => {
        const midAngle = (angles[index].start + angles[index].end) / 2;
        const radius = 5; 
        const x = radius * Math.cos(midAngle);
        const z = radius * Math.sin(midAngle);
        const y = 2; 
        const labelRotation: [number, number, number] = [0, -midAngle, 0];
        return (
          <group key={brand.name} position={[x, y, z]} rotation={labelRotation}>
            <Text
              position={[0, 0, 0]}
              fontSize={1.1}
              color="transparent"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor={textcolours[index % textcolours.length]}
              maxWidth={3}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign="center"
            >
              {brand.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// The main component that fetches data and renders the 3D Canvas
function BrandsTorusDisplay() {
  const [topBrands, setTopBrands] = useState<Brand[]>([]);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      // Fetch current user transactions
      const transactions = await getCurrentUserTransactions();
      if (!transactions) return;
  
      // Get partner data based on the transactions' partnerIDs
      const partnerIDs = transactions.map((t: any) => t.partnerID);
      const partnerData = await getPartnerIds(partnerIDs);
      if (!partnerData) return;
  
      // partnerID => partnerName
      const partnerMap = new Map<string, string>();
      partnerData.forEach((partner: any) => {
        if (partner.partnerID && partner.partnerName) {
          partnerMap.set(partner.partnerID, partner.partnerName);
        }
      });
  
      // Initialise counts and dynamic savings for each brand
      const brandCounts: Record<string, number> = {};
      const brandSavings: Record<string, number> = {};
  
      transactions.forEach((transaction: any) => {
        const partnerID = transaction.partnerID;
        const brand = partnerMap.get(partnerID);
        if (brand) {
          // Increment count for the brand
          brandCounts[brand] = (brandCounts[brand] || 0) + 1;
          // Calculate dynamic savings: amountSpent * (discountPercentage / 100)
          const amountSpent = parseFloat(transaction.amountSpent) || 0;
          const discountPercentage = parseFloat(transaction.discountPercentage) || 0;
          const savings = amountSpent * (discountPercentage / 100);
          brandSavings[brand] = (brandSavings[brand] || 0) + savings;
        }
      });
  
      // Create an array of brands with their counts and dynamic savings,
      // sorting them by savings (highest first)
      const sortedBrands = Object.entries(brandSavings)
        .map(([name, savings]) => ({
          name,
          count: brandCounts[name] || 0,
          savings
        }))
        .sort((a, b) => b.savings - a.savings);
  
      // Calculate the total savings across all brands
      const total = Object.values(brandSavings).reduce((sum, val) => sum + val, 0);
      setTotalSavings(total);
  
      // Pick the top five brands
      const topFive = sortedBrands.slice(0, 5);
      setTopBrands(topFive);
    }
    fetchData();
  }, []);
  

  // Calculate total for percentage
  const total = topBrands.reduce((sum, brand) => sum + brand.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', top: '500px' }}>
      <div style={{ height: '400px' }}>
        <Canvas style={{ height: '400px', top: '15vh'  }} camera={{ position: [5, 8, 10], fov: 75 }}>
          <ambientLight intensity={1.25} />
          <pointLight position={[10, 10, 10]} />
          <RotatingTorus topBrands={topBrands} />
          <OrbitControls 
            minDistance={8}
            maxDistance={20}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
          />
        </Canvas>
      </div>
      
      {/* Legend Box */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '4px',
        borderRadius: '12px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: '300px',
        margin: '0 auto',
        marginTop: '15vh',
        
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '1px'
        }}>
         Brands You Saved the Most With
        </div>

        {/* List of Top Brands */}
        {topBrands.map((brand, index) => {
          const percentage = totalSavings > 0 ? ((brand.savings / totalSavings) * 100).toFixed(1) : "0";
          return (
            <div key={brand.name} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '2px 4px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: colours[index % colours.length],
                  borderRadius: '2px'
                }} />
                <span style={{ fontSize: '14px' }}>{brand.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '16px' }}>
                <span>{percentage}%</span>
                <span>${brand.savings.toLocaleString()}</span>
              </div>
            </div>
          );
        })}

        {/* Total Savings at the bottom */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          marginTop: '0px'
        }}>
          Total Savings: ${totalSavings.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default BrandsTorusDisplay;
