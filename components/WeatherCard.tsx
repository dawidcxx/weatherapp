import { Box, makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { ChartOptions } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

const useStyles = makeStyles(() => ({
    root: {
        marginTop: '1rem',
        maxWidth: 240,
        position: 'relative',
        marginRight: '1rem',
    },
    icon: {
        width: 50,
        height: 50,
        padding: 4,
        backgroundColor: '#eee',
        marginBottom: 7,
        borderRadius: 35,
        position: 'absolute',
        right: 3,
        top: 3,
    },
    footer: {
        paddingLeft: 7,
        position: 'absolute',
        marginBottom: 0,
        left: 0,
        bottom: 0,
        height: 52,
        fontWeight: 'lighter',
        color: 'rgba(0,0,0,0.96)',
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    chartBottomPaddingBox: {    
        backgroundColor: 'rgba(253, 184, 19, 0.5)',
        background: 'red',
        width: '100%',
        height: '3rem'
    }
}));


const options: ChartOptions = {
    legend: {
        display: false,
    },
    scales: {
        display: false,
        xAxes: [
            { display: false, }
        ],
        yAxes: [
            { ticks: { beginAtZero: true  }, display: false }
        ],
    },
};


export interface WeatherCardProps {
    cityName: string,
    iconSymbol: string,
    tempSeries: Array<{
        value: number,
        value_at: Date | string,
    }>
}


export function WeatherCard({
    iconSymbol,
    tempSeries,
    cityName,
}: WeatherCardProps) {
    const classes = useStyles();

    const data = {
        labels: tempSeries.map(t => mapDateToLabel(t.value_at)),
        datasets: [
            {
                label: '°C',
                data: tempSeries.map(t => t.value),
                fill: true,
                borderColor: 'rgb(253, 184, 19)',
                backgroundColor: 'rgba(253, 184, 19, 0.5)',
            }
        ]
    };

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <Box m={5} />
                <CardMedia
                    alt={iconSymbol}
                    image={`/weathericon/svg/${iconSymbol}.svg`}
                    className={classes.icon}
                    component="img"
                />
                <Line
                    data={data}
                    options={options}
                />
                <div className={classes.chartBottomPaddingBox} />
                <Typography gutterBottom variant="h6" component="h2" className={classes.footer}>
                    {cityName}, next 24h
                </Typography>
            </CardActionArea>
        </Card>
    );
}

function mapDateToLabel(timestamp: string | Date) {
    const date = new Date(timestamp);
    let language;
    if (process.browser) {
        language = navigator.language;
    } else {
        language = 'en-US';
    }
    const result = date.toLocaleTimeString(language, {
        hour: '2-digit',
        minute: '2-digit'
    });
    return result;
}