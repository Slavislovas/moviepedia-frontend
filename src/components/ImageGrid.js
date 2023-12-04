import React from 'react';
import { Grid, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ImageGrid = ({ items, userRole }) => {
  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center', padding: 2 }}>
      {items.map((item, index) => (
        // Add a conditional check here
        (item.role === null || item.role === undefined || item.role === userRole || userRole === 'ROLE_ADMIN') && (
          <Grid item key={index} xs={12} sm={6} md={4} lg={2}>
            <Card elevation={3} sx={{ maxWidth: 300, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
              <Link to={item.link} style={{ textDecoration: 'none' }}>
                <CardActionArea component={Link} to={item.link}>
                  <CardMedia
                    component="img"
                    height="200"
                    width="100%"
                    image={item.pictureFilePath}
                    alt={item.title}
                    sx={{ objectFit: 'contain', height: 200 }}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
        )
      ))}
    </Grid>
  );
};

export default ImageGrid;