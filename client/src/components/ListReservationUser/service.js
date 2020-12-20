import { useEffect } from 'react';
import useStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from '../../store/actions';

export const useListReservationUser = () => {
  const classes = useStyles();
  const reservations = useSelector(({ auth }) => auth.reservation);
  const isLoading = useSelector(({ utils }) => utils.isLoading);
  const userId = useSelector(({ auth }) => auth.user._id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.fetchReservationUser(userId));
  }, [dispatch, userId]);

  return { classes, reservations, isLoading };
};