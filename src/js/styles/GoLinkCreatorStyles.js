'use es6';

export default theme => ({
  container: {
    maxWidth: 1000,
    flexGrow: 1,
  },
  listTitle: {
    marginBottom: '0.1in',
  },
  listItem: {
    background: theme.palette.background.paper,
  },
  content: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: '0.05in',
  },
});
