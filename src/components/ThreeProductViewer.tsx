import React from 'react';
import { GiftIdea, MatchedProduct } from '../types';
import { RealProductVisualizer } from './RealProductVisualizer';

interface ThreeProductViewerProps {
  gift: GiftIdea | MatchedProduct;
  onClose: () => void;
}

/**
 * ThreeProductViewer is upgraded to RealProductVisualizer to provide authentic,
 * photorealistic product photography, multi-angle optical loupe magnification,
 * real-life physical scale comparison, and realistic packaging unboxing simulation
 * rather than cartoonish 3D primitives or low-poly animated meshes.
 */
export const ThreeProductViewer: React.FC<ThreeProductViewerProps> = ({ gift, onClose }) => {
  return <RealProductVisualizer gift={gift} onClose={onClose} />;
};

export default ThreeProductViewer;
