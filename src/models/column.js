
const column = ({...args}) => {

  let myCol = {
      price: args.price,
      currency: args.currency,
      id: args.id,
      photos: args.photos || [],
      partNumber: args.partNumber,
      count: args.count,
      description: args.description,
      productName: args.productName
  };

  return myCol

};

export default column;