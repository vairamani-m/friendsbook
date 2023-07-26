import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Carousel = ({ images, id }) => {
  const videoRef = useRef(null);
  const [isExpandedView, setIsExpandedView] = useState(false);

  const { theme } = useSelector(state => state)

  const isActive = (index) => {
    if(index === 0) return "active"
  }
  
  useEffect(() => {
    const checkExpandedView = () => {
      const videoPlayer = videoRef.current;
      if (videoPlayer) {
        const { clientWidth, clientHeight } = videoPlayer;
        const threshold = 600;
        const isExpanded = clientWidth >= threshold && clientHeight >= threshold;
        setIsExpandedView(isExpanded);
      }
    };

    checkExpandedView();
    window.addEventListener('resize', checkExpandedView);

    return () => {
      window.removeEventListener('resize', checkExpandedView);
    };
  }, []);

  return (
    <div id={`image${id}`} className="carousel slide" data-ride="carousel">
      <ol className="carousel-indicators" style={{zIndex: 1}}>
          {
            images.map((image, index) => (
              <li key={index} data-target={`#image${id}`} data-slide-to="0" className={isActive(index)}></li>
            ))
          }
      </ol>
      <div className="carousel-inner">
        {
          images.map((image, index) => (
            <div key={index} className={`carousel-item ${isActive(index)}`}>
              {
                image.url.match(/video/i) ?
                <video controls className="d-block w-100" src={image.url} alt="post_video" ref={videoRef} style={{ filter: theme ? (isExpandedView ? 'invert(0)' : 'invert(1)') : 'invert(0)' }} />
                :<img className="d-block w-100" src={image.url} alt="post_image" style={{ filter : theme ? 'invert(1)' : 'invert(0)'}}/>
              }
            </div>
          ))
        }
      </div>
      {
        images.length > 1 && 
        <>
          <a className="carousel-control-prev" href={`#image${id}`} role="button" data-slide="prev" style={{width:'5%'}}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href={`#image${id}`} role="button" data-slide="next" style={{width:'5%'}}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </>
      }
    </div>
  )
}

export default Carousel
