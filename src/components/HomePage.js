import { Paper, Typography } from '@mui/material';
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import '../homepage.css';


const cardData = [
  { title: 'Welcome to MoviePedia', description: 'The place for film enthusiasts to share their thoughts and discover new movies.' },
  { title: 'Explore Movies', description: 'Discover a vast collection of movies, explore details, and find recommendations.' },
  { title: 'Connect with Others', description: 'Connect with fellow movie lovers, discuss your favorite films, and share your reviews.' },
];

const HomePage = () => {
  return (
    <div className="home-container">
      <Carousel>
        {cardData.map((card, index) => (
          <Paper key={index} elevation={10} className="carousel-item">
            <Typography variant="h4" component="div">
              {card.title}
            </Typography>
            <Typography variant="body1" component="div">
              {card.description}
            </Typography>
          </Paper>
        ))}
      </Carousel>
    </div>
  );
};

export default HomePage;