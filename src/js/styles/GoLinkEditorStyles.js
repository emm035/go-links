'use es6';

export default theme => ({
  chip: {
    margin: theme.spacing.unit / 2,
  },
  flexContainer: {
    display: 'flex',
  },
  aliasInput: {
    flexGrow: 1,
  },
  drawer: {
    width: '90%',
    maxWidth: '800px',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing.unit,
  },
});
