import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getUserInfo } from "./../../ducks/userReducer";

class FileUpload extends Component {
  constructor() {
    super();

    this.state = {
      careerImages: [],
      eduImages: [],
      file: "",
      filename: "",
      filetype: ""
    };
    this.handlePhoto = this.handlePhoto.bind(this);
    this.sendPhoto = this.sendPhoto.bind(this);
  }

  componentDidMount() {
    this.props.getUserInfo();
  }
  sendToback(photo) {
    return axios.post("/api/photoUpload", photo);
  }

  handlePhoto(event) {
    const reader = new FileReader(),
      file = event.target.files[0],
      _this = this;

    reader.onload = photo => {
      this.setState({
        file: photo.target.result,
        filename: file.name,
        filetype: file.type
      });
    };
    reader.readAsDataURL(file);
  }

  sendPhoto(event) {
    event.preventDefault();
    let stuffToSend = {
      file: this.state.file,
      filename: this.state.filename,
      filetype: this.state.filetype
    };
    this.sendToback(stuffToSend).then(response => {
      console.log("Upload response", response.data);
      this.uploadPhotoToDB(response)
    });
  }

  uploadPhotoToDB(response) {
    let body = {
      img: response.data.Location
    };
    if(this.props.component === 'work'){
    axios.post("/api/add_uploads", body).then(response => {
      this.setState({careerImages: response.data})
    })}
    else if (this.props.component === "edu"){
      axios.post("/api/add_edu_uploads", body).then(response => {
        this.setState({eduImages: response.data})
      })
    }
    else {
      console.log('props not passed correctly')
    }
    this.setState({file: "",
    filename: "",
    filetype: ""})
  }

  render() {
    this.state.file && console.log(this.state.photo);
    return (
      <div hidden={!this.props.user.display_name} className="container mr-5">
        <form className="container">
          <div className="form-group container mr-5">
            <label className="btn-secondary" htmlFor="formControlFile">Upload Resume</label>
            <input
              className="form-control-file btn-light"
              type="file"
              defaultValue=""
              onChange={this.handlePhoto}
              width="75px"
            />
             <button className="btn btn-secondary" onClick={this.sendPhoto}>
          Submit
        </button>
          </div>
        </form>
       
        {this.state.file && (
          <img src={this.state.file} alt="" className="file-preview" height="75px" width="75px" />
        )}

        <div>My Documents
          <div>
          {this.props.component === 'work' ? (this.state.careerImages.map(image => {
            console.log(image)
            return <span key={image.img_url} className="container mr-2"><img src={image.img_url}  height="75px" width="75px" /></span>
          }))
        :
         ( this.state.eduImages.map(image => {
          return <span key={image.img_url} className="container mr-2"><img src={image.img_url}  height="75px" width="75px" /> </span>
        }))
      }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.users.user
  };
}

export default connect(mapStateToProps, { getUserInfo })(FileUpload);
