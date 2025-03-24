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
  const [imageInBoard, setImageInBoard] = useState<string>(WhiteImage);

  useEffect(() => {
    if (brand === "Sports Direct") {
      setImageInBoard(SportsDirectImage);
    } else if (brand === "currys") {
      setImageInBoard(CurrysImage);
    } else if (brand === "Holland And Barrett") {
      setImageInBoard(HandBImage);
    } else if (brand === "Boots") {
      setImageInBoard(BootsImage);
    } else if (brand === "hp") {
      setImageInBoard(HpImage);
    } else {
      setImageInBoard(WhiteImage);
    }
  }, [brand]);

  return <img src={imageInBoard} className='imagesInBoard'/>;
}

export default ImageBox;