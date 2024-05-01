import {Component} from 'react'
import Header from '../Header/Header.js'
import Cookies from 'js-cookie'
import JobCard from '../JobCard/JobCard.js'
import {v4} from 'uuid'
import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
class Jobs extends Component {
  state = {
    listOfCheckBoxInputs: [],
    profileDetails: {},
    selectedRadioButton: '',
    jobsList: [],
  }

  componentDidMount() {
    this.getDataAndFetch()
  }
  getDataAndFetch = async () => {
    const purl = 'https://apis.ccbp.in/profile'
    const options1 = {
      method: 'GET',
      headers: {Authorization: `Bearer ${Cookies.get('jwt_token')}`},
    }
    const response1 = await fetch(purl, options1)
    const pData1 = await response1.json()
    const pData = pData1.profile_details
    console.log('profile', pData)

    const updatedProfile = {
      name: pData.name,
      profileImageUrl: pData.profile_image_url,
      shortBio: pData.short_bio,
    }
    this.setState({profileDetails: updatedProfile})

    console.log('token', Cookies.get('jwt_token'))
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }
    const {selectedRadioButton, listOfCheckBoxInputs} = this.state
    const empType = listOfCheckBoxInputs.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${empType}&minimum_package=${selectedRadioButton}&search=`

    const response = await fetch(url, options)
    const data = await response.json()
    console.log('data', data)
    const listOfData = data.jobs
    const updatedDataList = listOfData.map(eachObject => ({
      companyLogourl: eachObject.company_logo_url,
      employementType: eachObject.employment_type,
      id: eachObject.id,
      jobDescription: eachObject.job_description,
      location: eachObject.location,
      packagePerAnnum: eachObject.package_per_annum,
      rating: eachObject.rating,
      title: eachObject.title,
    }))

    this.setState({jobsList: updatedDataList})
  }

  onClickRadiaButton = event => {
    console.log(event.target.value)
    this.setState(
      {selectedRadioButton: event.target.value},
      this.getDataAndFetch,
    )
  }

  onClickCheckBox = event => {
    const {listOfCheckBoxInputs} = this.state
    const enteredChackBoxValue = event.target.value

    if (listOfCheckBoxInputs.includes(enteredChackBoxValue)) {
      this.setState(
        prevState => ({
          listOfCheckBoxInputs: prevState.listOfCheckBoxInputs.filter(
            eachItem => eachItem !== enteredChackBoxValue,
          ),
        }),
        this.getDataAndFetch,
      )
    } else {
      this.setState(
        prevState => ({
          listOfCheckBoxInputs: [
            ...prevState.listOfCheckBoxInputs,
            enteredChackBoxValue,
          ],
        }),
        this.getDataAndFetch,
      )
      console.log(listOfCheckBoxInputs)
    }
  }

  render() {
    const {listOfCheckBoxInputs, profileDetails, jobsList} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    console.log(listOfCheckBoxInputs.join(','))
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-container">
          <div className="filter-container">
            <div className="profile-box">
              <img src={profileImageUrl} alt={name} className="profile-image" />
              <h1 className="name">{name}</h1>
              <p className="role">{shortBio}</p>
            </div>
            <hr />
            <h1 className="heading-types-of-bobs">Type of Employment</h1>
            {employmentTypesList.map(eachObject => (
              <div className="employement-type-box">
                <input
                  type="checkbox"
                  className="input"
                  value={eachObject.employmentTypeId}
                  id={eachObject.employmentTypeId}
                  onChange={this.onClickCheckBox}
                  key={eachObject.employmentTypeId}
                />
                <label
                  htmlFor={eachObject.employmentTypeId}
                  key={eachObject.employmentTypeId}
                >
                  {eachObject.label}
                </label>
              </div>
            ))}

            <h1 className="heading-types-of-bobs">Salary Range</h1>
            {salaryRangesList.map(eachObject => (
              <div className="employement-type-box">
                <input
                  type="radio"
                  className="input"
                  value={eachObject.salaryRangeId}
                  id={eachObject.salaryRangeId}
                  onChange={this.onClickRadiaButton}
                  key={eachObject.salaryRangeId}
                  name="radiogroup"
                />
                <label
                  htmlFor={eachObject.salaryRangeId}
                  key={eachObject.salaryRangeId}
                >
                  {eachObject.label}
                </label>
              </div>
            ))}
          </div>

          <ul className="job-cards-container">
            {jobsList.map(eachObject => (
              <JobCard object={eachObject} key={v4()} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Jobs
