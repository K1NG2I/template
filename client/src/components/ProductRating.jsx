import { useState, useEffect } from 'react';
import Rating from './Rating';

export default function ProductRating({ productIndex }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (productIndex === undefined || productIndex === null) return;
    fetch(`/api/reviews?product=${productIndex}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [productIndex]);

  if (!data) return null;
  return <Rating average={data.average} count={data.count} size="sm" />;
}
