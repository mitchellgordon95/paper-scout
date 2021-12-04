import Modal from 'react-modal'
import Flexbox from 'flexbox-react'

function RulesModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen}>
      <Flexbox
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-end"
      >
        <button onClick={onClose}>Close</button>
      </Flexbox>
      <p>
        Paper Scout is a GAME in which you get POINTS for ENDORSING popular
        academic papers. The earlier you endorse, the more points you get.
      </p>
      <Flexbox flexDirection="row" justifyContent="space-evenly">
        <img
          alt="endorsement star"
          src="https://en.pimg.jp/047/720/601/1/47720601.jpg"
          width="100px"
          height="100px"
        />
        <img
          alt="endorsement star"
          src="https://en.pimg.jp/047/720/601/1/47720601.jpg"
          width="100px"
          height="100px"
        />
        <img
          alt="endorsement star"
          src="https://en.pimg.jp/047/720/601/1/47720601.jpg"
          width="100px"
          height="100px"
        />
        <img
          alt="endorsement star"
          src="https://en.pimg.jp/047/720/601/1/47720601.jpg"
          width="100px"
          height="100px"
        />
        <img
          alt="endorsement star"
          src="https://en.pimg.jp/047/720/601/1/47720601.jpg"
          width="100px"
          height="100px"
        />
      </Flexbox>

      <p>
        You get 5 ENDORSEMENT STARS total. If you'd like to endorse a 6th paper,
        you must drop one of your existing endorsements (and therefore stop
        collecting points from it).
      </p>

      <p>
        As long as your endorsement is on a paper, you get a point for every
        other person who endorses that paper.
      </p>
    </Modal>
  )
}

export default RulesModal
