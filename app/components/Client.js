import Avatar from 'react-avatar'
const Client =({userName})=>{
    return <>
    <div >
        <Avatar name={userName} size={50} round="14px">

        </Avatar>
        <div className="text-white"> {userName}</div>
    </div>
    </>
}
export default Client;