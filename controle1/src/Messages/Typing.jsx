import Loader from './Loader'

function Typing({ nom }) {
  return (
    <div className="typing">
      <span>{nom}</span>
      <Loader />
    </div>
  )
}

export default Typing
