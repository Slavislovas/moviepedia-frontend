import { useUser } from "../config/UserContext";
import ImageGrid from "./ImageGrid";

const ContentPanel = () => {
    const { user } = useUser();

    const cards = [
        {pictureFilePath: 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png',
         title: 'Users',
         link: '/content-panel/users',
         role: 'ROLE_ADMIN'
        },
        {pictureFilePath: 'https://cdn-icons-png.flaticon.com/512/2590/2590947.png',
         title: 'Actors',
         link: '/content-panel/actors',
         role: 'ROLE_CONTENT_CURATOR'
        },
        {pictureFilePath: 'https://cdn-icons-png.flaticon.com/512/974/974127.png',
        title: 'Directors',
        link: '/content-panel/directors',
        role: 'ROLE_CONTENT_CURATOR'
        },
        {pictureFilePath: 'https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/movie-icon.png',
        title: 'Movies',
        link: '/content-panel/movies',
        role: 'ROLE_CONTENT_CURATOR'
        }
    ];
  
    return (
      <div>
            <ImageGrid items={cards} userRole={user.userRole}/>
      </div>
    );
  };
  
  export default ContentPanel;