import {Link} from 'react-router-dom'
import NextContext from '../../context/NextContext'
import Header from '../Header'
import SideBar from '../SideBar'
import Add from '../Add'
import {HomeContainer} from '../../StyledComponents'
import './index.css'

const SavedVideos = () => (
    <NextContext.Consumer>
    {value => {
    const {darkTheme, changeTheme, showAdd, deleteAdd, savedVideos } = value
    console.log(savedVideos)
    const background = darkTheme ? "dark" : "light"
    const savedItems = savedVideos.length===0
    console.log(savedItems)
     
      return (
        <div>
        <Header theme={darkTheme} changeTheme={changeTheme}/>
        <HomeContainer background={darkTheme}>
        <div>
        <SideBar theme = {darkTheme} />
        </div>
        <div>
        <Add show={showAdd} deleteAdd={deleteAdd} />
        {savedItems ? 
        <div className="no-videos-container">
          <img className="no-videos" src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png" alt="no saved videos" />
          <h1>No saved videos found</h1>
          <p>Save your videos by clicking a button</p>
        </div> 
        :
        <div>
        <h1>Saved Videos</h1>
        <ul>
        {savedVideos.map((item)=>(
          <li className="items" key={item.id}>
          <Link to={`/videos/${item.id}/`}>
          <img className="image" src={item.thumbnailUrl} alt="video thumbnail" />
          <div>
          <p>{item.title}</p>
          <p>{item.name}</p>
          <p>{item.viewCount}</p>
          <p>{item.publishedAt}</p>
          </div>
          </Link>
          </li>
          ))}
        </ul>
        </div> }
        </div>
        </HomeContainer>
            </div>
        )
    }}
    </NextContext.Consumer>
)

export default SavedVideos