'use es6';

export default theme => ({
  header: {
    padding: '0.25in',
    background: '#425b76',
  },
  title: {
    marginBottom: '0.1in',
    color: '#e5f5f8',
  },
  linkListContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  linkList: {
    flexGrow: 1,
    maxWidth: 1000,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});
