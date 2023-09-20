import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import SideBar from '../SideBar'
import Add from '../Add'
import {HomeContainer, Input} from '../../StyledComponents'
import NextContext from '../../context/NextContext'

import './index.css'

const api = {initial:"INITIAL", inProgress:"INPROGRESS", success:"SUCCESS", failure:"FAILURE"}
class Home extends Component{
  state = {apiStatus:api.initial, data:[], searchInput:""} 

  componentDidMount () {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus:api.inProgress})
    const {searchInput} = this.state
    const jwtToken = Cookies.get("jwt_token")
    const url = `https://apis.ccbp.in/videos/all?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    
    if (response.ok===true){
      const updated = data.videos 
      const updatedData = updated.map((item)=>({
      id:item.id,
      thumbnailUrl: item.thumbnail_url,
      profileImageUrl:item.channel.profile_image_url,
      title:item.title,
      name:item.channel.name,
      viewCount: item.view_count,
      publishedAt: item.published_at
    }))
      this.setState({data:updatedData, apiStatus:api.success})
    }else{
      this.setState({apiStatus:api.failure})
    }
  }

  searchValue = e =>{
    this.setState({searchInput:e.target.value})
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="blue" height="50" width="50" />
    </div>
  )

  renderDetailsOnRetry = () => {
    this.getData()
  }

  searchButtonClicked = () =>{
    this.getData()
  } 

  failureView = () => (
    <NextContext.Consumer>
    {value => {
      const {darkTheme} = value 
      return (
        <div>
        {darkTheme ? 
        (<div className="failure">
        <img className="failure-logo" src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png" alt="failure view" />
        <h1>Oops! Something Went Wrong</h1>
        <p>We are having some trouble to complete your request. Please try again.</p>
        <button onClick={this.renderDetailsOnRetry} type="button">Retry</button>
        </div>)
         : 
         (<div className="failure">
        <img className="failure-logo" src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png" alt="failure view" />
        <h1>Oops! Something Went Wrong</h1>
        <p>We are having some trouble to complete your request. Please try again.</p>
        <button onClick={this.renderDetailsOnRetry} type="button">Retry</button>
         </div>)}
        </div>
      )
    }}
    </NextContext.Consumer>
  )


  renderData = () => {
    const {apiStatus, data} = this.state 
    if (apiStatus==="SUCCESS"){
      if (data.length===0){
        return (
          <div>
          <img src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png" alt="no videos" />
          <h1>No Search results found</h1>
          <p>Try different key words or remove search filter</p>
          <button>Retry</button>
          </div>
        )

      }else{
      return (
        <div>
        <ul className="container">
        {data.map((item)=>(          
          <li className="item" key={item.id}>
          <Link to={`/videos/${item.id}`} className="lint-styling">
          <img className="thumbnail"  src={item.thumbnailUrl} alt="video thumbnail" />
          <div className="title">
          <img className="profile" src={item.profileImageUrl} alt="channel logo" />
          <p>{item.title}</p>
          </div>
          <p>{item.name}</p>
          <div className="item">
          <p>{item.viewCount}</p>
          <p>{item.publishedAt}</p>
          </div>
          </Link>
          </li>          
        ))}
        </ul>
        </div>
      )
      }
    }else{
     return this.failureView()
    }
  }


  render(){
    const {apiStatus, data} = this.state
    const apis = apiStatus==="INPROGRESS"
    return (
  <NextContext.Consumer>

    {value => {
      const {darkTheme, changeTheme, showAdd, deleteAdd} = value
      const background = darkTheme ? "dark" : "light"
     
      return (
        <div>
        <Header theme={darkTheme} changeTheme={changeTheme}/>
        <HomeContainer background={darkTheme}>
        <div>
        <SideBar theme = {darkTheme} />
        </div>
        <div>
        <Add show={showAdd} deleteAdd={deleteAdd} />
        <Input type="search" placeholder="Shearch" onChange={this.searchValue}></Input>
        <button data-testid="searchButton" onClick={this.searchButtonClicked}>
        <AiOutlineSearch />
        </button>
        <div >
        {apis ? this.renderLoader()
         : 
         this.renderData()}
        </div>
        </div>
        </HomeContainer>
        </div>
      )}}
      </NextContext.Consumer>
)
}
}

export default Home
