import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGiphySearchbox from 'react-giphy-searchbox';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {
  ANNOUNCEMENT,
  SEND_DIRECT,
  CLEAR_INCOMING,
} from '../../reducers/mapReducer';
import { FaClipboardList } from 'react-icons/fa';
function Chat({ canOpen }) {
  const [chatboxShow, setChatboxShow] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [receiver, setReceiver] = useState('Everyone');
  const dispatch = useDispatch();
  const { width, height, topMargin, leftMargin } = useWindowDimensions();
  const userId = useSelector((state) => state.user.id);
  const playersArr = useSelector((state) => state.players);
  const incomingGifState = useSelector((state) => state.incomingGif);
  const onlineUsers = useSelector((state) => state.players);

  useEffect(() => {
    if (!incomingGifState.gifObj || !canOpen) return;
    setShowGif(true);
    let timer;
    timer = setTimeout(() => {
      setShowGif(false);
      dispatch(CLEAR_INCOMING());
    }, 5200);

    // return () => {
    //   clearTimeout(timer);
    // };
  }, [incomingGifState, canOpen]);

  const toggleGifSearch = () => {
    setChatboxShow(!chatboxShow);
  };
  const userArr = [];
  for (let key in onlineUsers) {
    userArr.push(onlineUsers[key].name);
  }
  const userSelectList = userArr.map((e, i) => {
    return (
      <option key={i} value={e}>
        {e}
      </option>
    );
  });

  return (
    <>
      {canOpen &&
        playersArr[userId] !== undefined &&
        playersArr[userId].socketId &&
        playersArr[userId].skin && (
          <button
            className="nes-btn is-primary"
            onClick={toggleGifSearch}
            style={{
              zIndex: 20,
              position: 'absolute',
              left: `${width - leftMargin - 205}px`,
              top: `${topMargin - 50}px`,
              width: '200px',
            }}>
            Send a GIF
          </button>
        )}
      {canOpen && (
        <div>
          <h1
            style={{
              left: `${leftMargin}px`,
              top: `${topMargin - 10}px`,
              margin: '0 15px 0',
              position: 'absolute',
              zIndex: -200,
              color: 'white',
            }}>
            WorkLand
          </h1>

          {/* <FaClipboardList
            className="icon"
            style={{
              zIndex: 20,
              position: 'absolute',
              left: `${width - leftMargin - 120}px`,
              top: `${topMargin - 35}px`,
              width: '200px',
              color: 'white',
            }}></FaClipboardList> */}
        </div>
      )}
      {chatboxShow && canOpen && (
        <div
          className="rpgui-container framed float"
          style={{
            zIndex: 20,
            position: 'absolute',
            left: `${width / 2 + 200}px`,
            top: `${height / 2 - 100}px`,
            width: '335px',
            margin: '0 15px 0',
          }}>
          <div style={{ display: 'flex', 'justify-content': 'space-between' }}>
            <h3
              style={{
                color: 'white',
              }}>
              Send a GIF!
            </h3>
            <section class="icon-list">
              <i
                className="nes-icon close is-small nes-pointer"
                onClick={() => toggleGifSearch()}></i>
            </section>
          </div>
          <div
            style={{
              color: 'white',
            }}>
            To:{' '}
          </div>
          <select
            style={{
              width: '100%',
            }}
            name="pets"
            id="pet-select"
            onChange={(event) => setReceiver(event.target.value)}>
            <option value="">Everyone</option>
            {userSelectList}
          </select>
          <ReactGiphySearchbox
            masonryConfig={[
              { columns: 2, imageWidth: 110, gutter: 4 },
              { mq: '280px', columns: 2, imageWidth: 140, gutter: 4 },
            ]}
            apiKey="IqdjO72Noi1ikvZCa1ehpeiKkK7atZGd"
            onSelect={(item) => {
              toggleGifSearch();
              if (receiver === 'Everyone') {
                return dispatch(ANNOUNCEMENT({ gifObj: item }));
              }
              dispatch(SEND_DIRECT({ gifObj: item, receiverName: receiver }));
              setReceiver('Everyone');
            }}
          />
        </div>
      )}
      {showGif && canOpen && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            flexDirection: 'column',
            left: `${width / 2 + 260}px`, //260 to center the GIF within walls on the map
            top: `${height / 2 - 70}px`,
          }}>
          <p
            style={{
              width: '235px',
              marginBottom: '0px !important',
              padding: '10px 10px 10px 10px',
              justifyContent: 'center',
            }}
            className="nes-balloon from-right">
            A GIF' from: {incomingGifState.senderName} to{' '}
            {incomingGifState.receiverName === null
              ? 'everyone'
              : `${incomingGifState.receiverName}`}
          </p>

          <iframe
            style={{
              width: '235px',
              justifyContent: 'center',
            }}
            title="GIF"
            src={incomingGifState.gifObj.embed_url}
            width="320"
            height="320"
            frameBorder="0"
            className="giphy-embed"></iframe>
        </div>
      )}
    </>
  );
}

export default Chat;