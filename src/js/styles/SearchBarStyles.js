'use es6';

export default theme => ({
  searchContainer: {
    flexGrow: 1,
  },
  searchBar: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit,
    display: 'flex',
  },
  searchInput: {
    flexGrow: 1,
  },
});
