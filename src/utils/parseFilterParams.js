const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const contactType = (type) => ['work', 'home', 'personal'].includes(type);
  if (contactType(type)) return type;
};

const parseFavourite = (value) => {
  if (typeof value !== 'string') return;
  if (!['true', 'false'].includes(value)) return;
  if (value === 'true') return true;
  if (value === 'false') return false;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;
  const parsedType = parseType(contactType);
  const parsedFavourite = parseFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedFavourite,
  };
};
