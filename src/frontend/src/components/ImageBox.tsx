import React, { useEffect, useState } from 'react';
import WhiteImage from '../assets/White.svg';
import SportsDirectImage from '../assets/Sports Direct.svg';
import CurrysImage from '../assets/currys.svg';
import HandBImage from '../assets/H&B.svg';
import BootsImage from '../assets/Boots.svg';
import HpImage from '../assets/hp.svg';
type ImageBoxProps = {
  brand: string;
};

function ImageBox({ brand }: ImageBoxProps) {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    if (brand) {
      const imageUrl = `https://cdn.brandfetch.io/${brand}.com/w/256/h/256?c=1iduEc3aSox-3FW56Uc`;
      setLogoUrl(imageUrl);
      
    }
  }, [brand]); 

  return (
    <div>
      {logoUrl ? (
        <img src={logoUrl} alt={`${brand} Logo`} className= "imagesInBoard" />
      ) : (
        'Image rendering'
      )}
    </div>
  );
}

export default ImageBox;