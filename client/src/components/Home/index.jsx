import React from 'react';

import {
    Paper,
    Hidden,
    AccordionSummary,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow, TableCell, TableBody, Accordion
} from '@material-ui/core';

import useStyles from './styles';
import {useDispatch, useSelector} from "react-redux";
import {useConstructor} from "../../utils/customHooks";
import * as appActions from "../../store/actions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch()
    const traffic = useSelector(({auth}) => auth.traffic)
    useConstructor(() => {
        dispatch(appActions.fetchTrafficCourtPrize());
    });
  return (
    <>
      <Hidden lgUp>
        <div {...{ className: classes.main }}>
          <Paper {...{ elevation: 3 }} />
        </div>
      </Hidden>
      <Hidden xlDown>
        <div {...{ className: classes.root }}>
          <Paper {...{ elevation: 3 }} />
        </div>
      </Hidden>
      <Hidden smDown>
        <div {...{ className: classes.root }}>
          <Paper {...{ elevation: 3 }} />
        </div>
      </Hidden>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className={classes.title}>Cennik</Typography>
            </AccordionSummary>
            <TableContainer className={classes.table} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Strefa Boiska</TableCell>
                            <TableCell align="center">Zajęcia rekreacyjno-sportowe,treningi</TableCell>
                            <TableCell align="center">Mecze,turnieje</TableCell>
                            <TableCell align="center">Uczelniany Klub AZS UAM</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {traffic ? traffic.map(({classes_and_sports_training, id, name, tournament_matches, university_club}) => {
                            return (
                                <TableRow hover={true} key={id} >
                                    <TableCell align="center">
                                        {name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {classes_and_sports_training}
                                    </TableCell>
                                    <TableCell align="center">
                                        {tournament_matches}
                                    </TableCell>
                                    <TableCell align="center">
                                        {university_club}
                                    </TableCell>
                                </TableRow>
                            );
                        }) : null}
                    </TableBody>
                </Table>
            </TableContainer>
        </Accordion>
    </>
  );
};

export default Home;
