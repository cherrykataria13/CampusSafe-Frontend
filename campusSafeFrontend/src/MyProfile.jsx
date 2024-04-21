import Topbar from "./Topbar";
import UserDetails from "./components/UserDetails";
import './myProfile.css'

const MyProfile = () => {
  return (
    <div className="profile-container">
        <Topbar/>
        <h2>My Profile</h2>
        <div>
            <UserDetails/>
        </div>
    </div>
  )
}

export default MyProfile;