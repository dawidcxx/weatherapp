import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import React, { useEffect, useState } from 'react';
import { WeatherCard, WeatherCardProps } from '../components/WeatherCard';
import { Cords, forecastService, geolocationService } from '../service/services';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  searchBar: {
    padding: '2px 4px 2px 14px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  cardsContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  progressBar: {
    width: '100%',
  }
}));

export default function Home() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const [weatherCards, setWeatherCards] = useState<Array<WeatherCardProps>>([]);

  async function loadFromCords(cords: Cords) {
    setIsLoading(true);
    try {
      const [locationName, forecast] = await Promise.all([
        geolocationService.getCityNameFromLatLong(cords),
        forecastService.getForcecast(cords)
      ]);
      const symbol = forecast.properties.timeseries[0]?.data.next_12_hours.summary.symbol_code || 'cloudy';
      setWeatherCards(cards => [...cards, {
        cityName: locationName,
        iconSymbol: symbol,
        tempSeries: forecast.properties.timeseries.map(series => ({
          value_at: series.time,
          value: series.data.instant.details.air_temperature
        })),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  async function loadFromCityName() {
    setIsLoading(true);

    setIsLoading(false);
  }

  return (
    <div className={classes.container}>
      <Paper
        component="form"
        className={classes.searchBar}
        onSubmit={e => {
          e.preventDefault();
        }}>
        <InputBase
          className={classes.input}
          placeholder="Enter a City"
          disabled={isLoading}
          inputProps={{ 'aria-label': 'Enter a City' }}
        />
        <IconButton
          disabled={isLoading}
          type="button"
          className={classes.iconButton}
          aria-label="search"
          onClick={() => {
            navigator.geolocation.getCurrentPosition((pos) => {
              loadFromCords({ longitude: pos.coords.longitude, latitude: pos.coords.latitude });
            });
          }}
        >
          <MyLocationIcon />
        </IconButton>
      </Paper>
      {isLoading && <LinearProgress className={classes.progressBar} />}
      <div className={classes.cardsContainer}>
        {weatherCards.map((card, index) =>
          <WeatherCard {...card} key={index} />
        )}
      </div>

    </div>
  )
}

