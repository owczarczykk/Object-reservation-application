import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import { navigate, views } from 'react-big-calendar/lib/utils/constants';
import connect from 'react-redux/es/connect/connect';
import { selectMainThemeDark } from 'app/store/fuse/settingsSlice';

/* eslint-disable react/jsx-no-bind */
const styles = theme => ({
	root: {
		backgroundImage: 'url("/assets/images/backgrounds/header-bg.png")',
		backgroundColor: '#FAFAFA',
		color: '#FFFFFF',
		backgroundSize: 'cover',
		backgroundPosition: '0 50%',
		backgroundRepeat: 'no-repeat',
		'&:before': {
			content: "''",
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			zIndex: 1,
			background: 'rgba(0, 0, 0, 0.45)'
		},
		'&.sty': {
			backgroundImage: "url('/assets/images/calendar/winter.jpg')",
			backgroundPosition: '0 85%'
		},
		'&.lut': {
			backgroundImage: "url('/assets/images/calendar/winter.jpg')",
			backgroundPosition: '0 85%'
		},
		'&.mar': {
			backgroundImage: "url('/assets/images/calendar/spring.jpg')",
			backgroundPosition: '0 40%'
		},
		'&.kwi': {
			backgroundImage: "url('/assets/images/calendar/spring.jpg')",
			backgroundPosition: '0 40%'
		},
		'&.maj': {
			backgroundImage: "url('/assets/images/calendar/spring.jpg')",
			backgroundPosition: '0 40%'
		},
		'&.cze': {
			backgroundImage: "url('/assets/images/calendar/summer.jpg')",
			backgroundPosition: '0 80%'
		},
		'&.lip': {
			backgroundImage: "url('/assets/images/calendar/summer.jpg')",
			backgroundPosition: '0 80%'
		},
		'&.sie': {
			backgroundImage: "url('/assets/images/calendar/summer.jpg')",
			backgroundPosition: '0 80%'
		},
		'&.wrz': {
			backgroundImage: "url('/assets/images/calendar/autumn.jpg')",
			backgroundPosition: '0 40%'
		},
		'&.paź': {
			backgroundImage: "url('/assets/images/calendar/autumn.jpg')",
			backgroundPosition: '0 40%'
		},
		'&.lis': {
			backgroundImage: "url('/assets/images/calendar/autumn.jpg')",
			backgroundPosition: '0 40%'
		},
		'&.gru': {
			backgroundImage: "url('/assets/images/calendar/winter.jpg')",
			backgroundPosition: '0 85%'
		}
	}
});

class CalendarHeader extends Toolbar {
	render() {
		const { classes, mainThemeDark, label, date } = this.props;

		return (
			<ThemeProvider theme={mainThemeDark}>
				<div className={clsx(classes.root, 'flex h-200 min-h-200 relative', moment(date).format('MMM'))}>
					<div className="flex flex-1 flex-col p-12 justify-between z-10 container">
						<div className="flex flex-col items-center justify-between sm:flex-row">
							<div
								className="flex items-center my-16 sm:mb-0"
								onClick={this.navigate.bind(null, navigate.TODAY)}
								style={{
									cursor: 'default'
								}}
							>
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<Icon className="text-32 mx-12">today</Icon>
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography variant="h6">Kalendarz</Typography>
								</FuseAnimate>
							</div>
							<div className="flex items-center">
								<Tooltip title="Dzisiaj">
									<div>
										<FuseAnimate animation="transition.expandIn" delay={500}>
											<IconButton
												aria-label="today"
												onClick={this.navigate.bind(null, navigate.TODAY)}
											>
												<Icon>today</Icon>
											</IconButton>
										</FuseAnimate>
									</div>
								</Tooltip>
								<Tooltip title="Miesiąc">
									<div>
										<FuseAnimate animation="transition.expandIn" delay={500}>
											<IconButton
												aria-label="Month"
												onClick={() => this.props.onView(views.MONTH)}
											>
												<Icon>view_module</Icon>
											</IconButton>
										</FuseAnimate>
									</div>
								</Tooltip>
							</div>
						</div>

						<FuseAnimate delay={500}>
							<div className="flex items-center justify-center">
								<Tooltip title="Previous">
									<IconButton
										aria-label="Previous"
										onClick={this.navigate.bind(null, navigate.PREVIOUS)}
									>
										<Icon>
											{mainThemeDark.direction === 'ltr' ? 'chevron_left' : 'chevron_right'}
										</Icon>
									</IconButton>
								</Tooltip>
								<Typography
									variant="h6"
									style={{
										cursor: 'default'
									}}
								>
									{label}
								</Typography>
								<Tooltip title="Next">
									<IconButton aria-label="Next" onClick={this.navigate.bind(null, navigate.NEXT)}>
										<Icon>
											{mainThemeDark.direction === 'ltr' ? 'chevron_right' : 'chevron_left'}
										</Icon>
									</IconButton>
								</Tooltip>
							</div>
						</FuseAnimate>
					</div>
				</div>
			</ThemeProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		mainThemeDark: selectMainThemeDark(state)
	};
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(CalendarHeader));
