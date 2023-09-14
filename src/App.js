import { useState } from 'react'

export default function App() {
  const [selected, setSelected] = useState(0)
  const [isCalcClosed, setIsCalcClosed] = useState(true)
  const [friends, setFriends] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ])


  function handleSelect(id) {
    if (selected !== id) {
      setSelected(id)
      setIsCalcClosed(false)
    }
    else {
      setIsCalcClosed(true)
      setSelected(0)
    }
  }

  const selectedFriend = friends.filter((friend) => friend.id === selected)[0]

  function AddFriend(newFriend) {
    setFriends(friends => [...friends, newFriend])
  }

  function EditBalance(newBalance) {
    const filtered = friends.filter(friend => friend.id !== selectedFriend.id)
    selectedFriend.balance = selectedFriend.balance + newBalance
    setFriends([...filtered, selectedFriend])
    setIsCalcClosed(true)
  }

  return (
    <div className='app'>
      <FriendList
        friends={friends}
        selected={selected}
        onHandleSelect={handleSelect}
        isCalcClosed={isCalcClosed}
        onAddFriend={AddFriend}
      />
      <SplitDetails
        isCalcClosed={isCalcClosed}
        selectedFriend={selectedFriend}
        handleEditBalance={EditBalance}
      />
    </div>
  )
}

function FriendList({ friends, selected, onHandleSelect, isCalcClosed, onAddFriend }) {
  const [isAddClosed, setIsAddClosed] = useState(true)
  return (
    <div className="sidebar">
      <ul>
        {
          friends.map((friend) => {
            return <Friend
              friend={friend}
              key={friend.id}
              selected={selected}
              onHandleSelect={onHandleSelect}
              isCalcClosed={isCalcClosed}
            />
          })
        }
      </ul>
      <AddFriend
        isAddClosed={isAddClosed}
        setIsAddClosed={setIsAddClosed}
        onAddFriend={onAddFriend}
      />
    </div>
  )
}

function Friend({ friend, selected, onHandleSelect, isCalcClosed }) {
  return (
    <li className={selected === friend.id ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {
        friend.balance === 0 ? (<p>You and {friend.name} are even</p>) :
          friend.balance < 0 ? (<p class='red'>You owe {friend.name} P{Math.abs(friend.balance)}</p>) :
            (<p class='green'>{friend.name} owes you P{friend.balance}</p>)
      }
      <button className="button" onClick={() => onHandleSelect(friend.id)} >
        {selected === friend.id && !isCalcClosed ? 'Close' : 'Select'}
      </button>
    </li>
  )
}

function AddFriend({ isAddClosed, setIsAddClosed, onAddFriend }) {
  const [friendName, setFriendName] = useState('')
  const [img, setImg] = useState('')

  function handleAddSubmit(e) {
    e.preventDefault()

    if (friendName === '' || img === '') return
    const newFriend = { name: friendName, image: img, balance: 0, id: Date.now() }
    onAddFriend(newFriend)

    setFriendName('')
    setImg('')
  }

  return (
    <>
      {isAddClosed || (
        <form className='form-add-friend' onSubmit={handleAddSubmit}>
          <label htmlFor="name">🧑‍🦰Friend name</label>
          <input type="text" id="name" value={friendName} onChange={(e) => setFriendName(e.target.value)} />
          <label hrmlFor="img">🖼️Image URL</label>
          <input type="text" id="img" value={img} onChange={(e) => setImg(e.target.value)} />
          <button className='button'>Add</button>
        </form>
      )}
      <button
        className='button'
        onClick={() => { setIsAddClosed(isAddClosed => !isAddClosed) }}
      >{isAddClosed ? 'Add Friend' : 'Close'}
      </button>
    </>
  )
}

function SplitDetails({ isCalcClosed, selectedFriend, handleEditBalance }) {
  const [billValue, setBillValue] = useState(0)
  const [ownExpense, setOwnExpense] = useState(0)
  const [payer, setPayer] = useState(0)

  let friendExpense = billValue - ownExpense
  let newBalance;

  function handleSplit(e) {
    e.preventDefault()

    if (payer === 0) newBalance = friendExpense
    else newBalance = -ownExpense

    handleEditBalance(newBalance)

    setBillValue(0)
    setOwnExpense(0)
    setPayer(0)
  }

  return (
    <>
      {isCalcClosed || (
        <form className='form-split-bill' onSubmit={handleSplit}>
          <h2>Split with {selectedFriend.name}</h2>
          <label htmlFor="billValue" >💰 Bill Value</label>
          <input type="text" id='billValue' value={billValue} onChange={(e) => setBillValue(Number(e.target.value))} />
          <label htmlFor="ownExpense">💁 Your Expense</label>
          <input type="number" id='ownExpense' value={ownExpense} onChange={e => setOwnExpense(Number(e.target.value))} />
          <label htmlFor="friendExpense">🧎 {selectedFriend.name}'s Expense</label>
          <input type="text" id='friendExpense' disabled value={friendExpense} />
          <label>💸 Who is paying the bill?</label>
          <select value={payer} onChange={(e) => setPayer(e.target.value)}>
            <option value={0}>You</option>
            <option value={selectedFriend.id}>{selectedFriend.name}</option>
          </select>
          <button className='button'>Add</button>
        </form>
      )
      }
    </>
  )
}

