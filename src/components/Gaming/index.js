
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import NextContext from '../../context/NextContext'
import Header from '../Header'
import SideBar from '../SideBar'
import Add from '../Add'
import {HomeContainer, Input} from '../../StyledComponents'
import './index.css'

const api = {initial:"INITIAL", inProgress:"INPROGRESS", success:"SUCCESS", failure:"FAILURE"}
class Gaming extends Component {
  state = {apiStatus:api.initial, data:[]} 

  componentDidMount () {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus:api.inProgress})
    const jwtToken = Cookies.get("jwt_token")
    const url = `https://apis.ccbp.in/videos/gaming`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok===true){
      const updated = data.videos 
      const updatedList = updated.map((item)=>({
      id:item.id,
      title:item.title,
      thumbnailUrl : item.thumbnail_url,
      viewCount: item.view_count
    }))
      this.setState({data:updatedList, apiStatus:api.success})
    }else{
      this.setState({apiStatus:api.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="blue" height="50" width="50" />
    </div>
  )

  renderDetailsOnRetry = () => {
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
    const {data, apiStatus} = this.state 
    console.log(apiStatus)
    if (apiStatus==="SUCCESS"){
      return (
        <div>
        <h1>Gaming</h1>
        <ul className="list-items">
        {data.map((item) => (
          <li key={item.id}>
          <Link to={`/videos/${item.id}`}>
          <img className="image" src={item.thumbnailUrl} alt="video thumbnail" />
          <p>{item.title}</p>
          <p>{item.viewCount}</p>
          </Link>
          </li>
        ))}
        </ul>
        </div>
      )
    }else{
      return this.failureView()
    }
  }
  
  render () {
    const {apiStatus} = this.state 
    const apis = apiStatus==="INPROGRESS"
    return (
      <NextContext.Consumer>
    {value => {
    const {darkTheme, changeTheme, showAdd, deleteAdd } = value
     
      return (
                <div>
        <Header theme={darkTheme} changeTheme={changeTheme}/>
        <HomeContainer background={darkTheme}>
        <div>
        <SideBar theme = {darkTheme} />
        </div>
        <div>
        <Add show={showAdd} deleteAdd={deleteAdd} />
        <div >
        {apis ? this.renderLoader()
         : 
         this.renderData()}
        </div>
        </div>
        </HomeContainer>
        </div>
        )
    }}
    </NextContext.Consumer>
    )
  }
}
export default Gaming