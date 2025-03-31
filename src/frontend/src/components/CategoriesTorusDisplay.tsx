import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { getCurrentUserTransactions, getPartnerIds } from '../services/API';
import * as THREE from 'three';

interface Category {
  category: string;
  count: number;
  savings: number;
}

// Colors for each of the top 5 categories (matching your brand palette)
const colors = ['#FF1744', '#FF9100', '#FFEA00', '#00E676', '#2979FF'];
const textColors = ['#C51162', '#DD6C00', '#C0B900', '#00A152', '#004FC4'];

function RotatingTorus({ topCategories }: { topCategories: Category[] }) {
  const torusRef = useRef<any>();

  // Total savings for calculating slice angles
  const totalSavings = topCategories.reduce((sum, cat) => sum + cat.savings, 0);

  // Pre-calculate slice angles for each category
  const angles: { start: number; end: number }[] = [];
  let currentAngle = 0;
  topCategories.forEach((cat) => {
    const sliceAngle = totalSavings > 0 ? (cat.savings / totalSavings) * Math.PI * 2 : 0;
    angles.push({ start: currentAngle, end: currentAngle + sliceAngle });
    currentAngle += sliceAngle;
  });

  // Create a torus segment geometry for the given angle range
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

  // Rotate the torus continuously
  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={torusRef}>
      {topCategories.map((cat, index) => {
        const { start, end } = angles[index];
        const color = colors[index % colors.length];
        const geometry = createTorusSegment(start, end);
        return (
          <mesh key={cat.category} geometry={geometry}>
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {topCategories.map((cat, index) => {
       const midAngle = (angles[index].start + angles[index].end) / 2;
       const labelRadius = 7;
       const x = labelRadius * Math.cos(midAngle);
       const z = labelRadius * Math.sin(midAngle);
       const y = 2.7;
       const labelRotation: [number, number, number] = [0, -midAngle, 0];
        return (
          <group key={cat.category} position={[x, y, z]} rotation={labelRotation}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.9}
              color="transparent"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor={textColors[index % textColors.length]}
              maxWidth={3}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign="center"
            >
              {cat.category}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function CategoriesTorusDisplay() {
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      // Fetch transactions and partner data
      const transactions = await getCurrentUserTransactions();
      if (!transactions) return;
      const partnerIDs = transactions.map((t: any) => t.partnerID);
      const partnerData = await getPartnerIds(partnerIDs);
      if (!partnerData) return;

      // Aggregate counts and savings by shopCategory
      const categoryCounts: Record<string, number> = {};
      const categorySavings: Record<string, number> = {};

      transactions.forEach((transaction: any) => {
        const partnerID = transaction.partnerID;
        const partner = partnerData.find((p: any) => p.partnerID === partnerID);
        if (partner && partner.shopCategory) {
          const category = partner.shopCategory;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          const amountSpent = parseFloat(transaction.amountSpent) || 0;
          const discountPercentage = parseFloat(transaction.discountPercentage) || 0;
          const savings = amountSpent * (discountPercentage / 100);
          categorySavings[category] = (categorySavings[category] || 0) + savings;
        }
      });

      // Build and sort category data based on savings
      const sortedCategories = Object.entries(categorySavings)
        .map(([category, savings]) => ({
          category,
          count: categoryCounts[category] || 0,
          savings
        }))
        .sort((a, b) => b.savings - a.savings);

      const total = Object.values(categorySavings).reduce((sum, val) => sum + val, 0);
      setTotalSavings(total);

      // Select the top 5 categories
      const topFive = sortedCategories.slice(0, 5);
      setTopCategories(topFive);
    }
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <div style={{ height: '400px', marginTop: '-10px' }}>
        <Canvas style={{ height: '400px' }} camera={{ position: [5, 8, 10], fov: 75 }}>
          <ambientLight intensity={1.25} />
          <pointLight position={[10, 10, 10]} />
          <RotatingTorus topCategories={topCategories} />
          <OrbitControls minDistance={8} maxDistance={20} enablePan={false} enableZoom={true} enableRotate={true} />
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
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '1px'
        }}>
          Categories You Saved the Most With
        </div>

        {topCategories.map((cat, index) => {
          const percentage = totalSavings > 0 ? ((cat.savings / totalSavings) * 100).toFixed(1) : "0";
          return (
            <div key={cat.category} style={{
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
                  backgroundColor: colors[index % colors.length],
                  borderRadius: '2px'
                }} />
                <span style={{ fontSize: '14px' }}>{cat.category}</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '16px' }}>
                <span>{percentage}%</span>
                <span>${cat.savings.toLocaleString()}</span>
              </div>
            </div>
          );
        })}

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

export default CategoriesTorusDisplay;
