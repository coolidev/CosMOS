const importAll = (r) => r.keys().map(r);

export const exploreImages = importAll(
  require['context'](
    '../../public/static/images/explore',
    false,
    /\.(png|jpe?g|svg)$/
  )
);

export const icons = importAll(
  require['context'](
    '../../public/static/icons',
    false,
    /\.(png|jpe?g|svg)$/
  )
);
