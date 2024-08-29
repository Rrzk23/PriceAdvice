const priceProcess = (price: string) => {
  if (!price) {
    return 'Not Price or Auction available.';
  }
  if (price.toLowerCase().includes('auction')) { 
    return 'Auction';
  }
  // optional to have dolloar sign, have zero or more space between the connecting words
  // must have connecting word
  const rangeMatch = price.match(/\$?([0-9,]+)\s*(?:-|to|between)\s*\$?([0-9,]+)/i);
  if (rangeMatch) {
    const minPrice = parseInt(rangeMatch[1].replace(/[\$,]/g, ''), 10);
    const maxPrice = parseInt(rangeMatch[2].replace(/[\$,]/g, ''), 10);
    return (minPrice + maxPrice) / 2; 
  }
  const singlePriceMatch = price.match(/\$?([0-9,]+)/);
  if (singlePriceMatch) {
    return parseInt(singlePriceMatch[1].replace(/[\$,]/g, ''), 10); 
  }
  return price;
};


export default priceProcess;
