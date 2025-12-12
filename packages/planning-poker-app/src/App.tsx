import { useState, useEffect, useCallback } from 'react'

interface Vote {
  userName: string
  value: string | number
  timestamp: number
}

interface RoomUser {
  userName: string
  lastSeen: number
}

const FIBONACCI_CARDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?']

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function getRoomIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('room')
}

function setRoomIdInUrl(roomId: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set('room', roomId)
  window.history.replaceState({}, '', url.toString())
}

function getStorageKey(roomId: string, userName: string): string {
  return `planning-poker-${roomId}-${userName}`
}

function getAllVotesForRoom(roomId: string): Vote[] {
  const votes: Vote[] = []
  const prefix = `planning-poker-${roomId}-`
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix) && !key.includes('users')) {
      try {
        const vote = JSON.parse(localStorage.getItem(key) || '{}') as Vote
        if (vote.userName && vote.value !== undefined) {
          votes.push(vote)
        }
      } catch (e) {
        // 無効なデータはスキップ
      }
    }
  }
  
  return votes
}

function getUsersKey(roomId: string): string {
  return `planning-poker-users-${roomId}`
}

function addUserToRoom(roomId: string, userName: string): void {
  if (!userName.trim()) return
  
  const usersKey = getUsersKey(roomId)
  const users = getActiveUsers(roomId)
  const existingUserIndex = users.findIndex(u => u.userName === userName.trim())
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex].lastSeen = Date.now()
  } else {
    users.push({
      userName: userName.trim(),
      lastSeen: Date.now()
    })
  }
  
  localStorage.setItem(usersKey, JSON.stringify(users))
}

function removeUserFromRoom(roomId: string, userName: string): void {
  const usersKey = getUsersKey(roomId)
  const users = getActiveUsers(roomId)
  const filteredUsers = users.filter(u => u.userName !== userName.trim())
  localStorage.setItem(usersKey, JSON.stringify(filteredUsers))
}

function getActiveUsers(roomId: string): RoomUser[] {
  const usersKey = getUsersKey(roomId)
  try {
    const usersJson = localStorage.getItem(usersKey)
    if (!usersJson) return []
    return JSON.parse(usersJson) as RoomUser[]
  } catch (e) {
    return []
  }
}

function cleanupInactiveUsers(roomId: string): RoomUser[] {
  const INACTIVE_THRESHOLD = 30000 // 30秒
  const users = getActiveUsers(roomId)
  const now = Date.now()
  const activeUsers = users.filter(u => now - u.lastSeen < INACTIVE_THRESHOLD)
  
  if (activeUsers.length !== users.length) {
    const usersKey = getUsersKey(roomId)
    localStorage.setItem(usersKey, JSON.stringify(activeUsers))
  }
  
  return activeUsers
}

function calculateStats(votes: Vote[]): {
  average: number
  min: number
  max: number
  median: number
  numericVotes: number[]
} {
  const numericVotes = votes
    .map(v => typeof v.value === 'number' ? v.value : null)
    .filter((v): v is number => v !== null)
  
  if (numericVotes.length === 0) {
    return { average: 0, min: 0, max: 0, median: 0, numericVotes: [] }
  }
  
  numericVotes.sort((a, b) => a - b)
  const sum = numericVotes.reduce((a, b) => a + b, 0)
  const average = sum / numericVotes.length
  const min = numericVotes[0]
  const max = numericVotes[numericVotes.length - 1]
  const median = numericVotes.length % 2 === 0
    ? (numericVotes[numericVotes.length / 2 - 1] + numericVotes[numericVotes.length / 2]) / 2
    : numericVotes[Math.floor(numericVotes.length / 2)]
  
  return { average, min, max, median, numericVotes }
}

function App() {
  const [roomId, setRoomId] = useState<string>(() => {
    const urlRoomId = getRoomIdFromUrl()
    if (urlRoomId) {
      return urlRoomId
    }
    const newRoomId = generateRoomId()
    setRoomIdInUrl(newRoomId)
    return newRoomId
  })
  
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('planning-poker-username') || ''
  })
  
  const [selectedCard, setSelectedCard] = useState<string | number | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [showResults, setShowResults] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeUsers, setActiveUsers] = useState<RoomUser[]>([])

  // ユーザー名を保存
  useEffect(() => {
    if (userName) {
      localStorage.setItem('planning-poker-username', userName)
    }
  }, [userName])

  // ルームIDが変更されたらURLを更新
  useEffect(() => {
    setRoomIdInUrl(roomId)
  }, [roomId])

  // 投票を読み込む
  const loadVotes = () => {
    const allVotes = getAllVotesForRoom(roomId)
    setVotes(allVotes)
  }

  // ユーザーリストを更新する関数
  const updateUsers = useCallback(() => {
    if (userName.trim()) {
      addUserToRoom(roomId, userName.trim())
    }
    const cleanedUsers = cleanupInactiveUsers(roomId)
    setActiveUsers(cleanedUsers)
  }, [userName, roomId])

  // 初期読み込み
  useEffect(() => {
    loadVotes()
    updateUsers()
  }, [roomId, updateUsers])

  // ユーザー名が変更されたらユーザーリストを更新
  useEffect(() => {
    if (userName.trim()) {
      updateUsers()
    }
  }, [userName, roomId, updateUsers])

  // 定期的にユーザーリストと投票を更新（ハートビート）
  useEffect(() => {
    if (!userName.trim()) return
    
    updateUsers()
    loadVotes()
    const interval = setInterval(() => {
      updateUsers()
      loadVotes()
    }, 5000) // 5秒ごとに更新
    
    return () => clearInterval(interval)
  }, [userName, roomId, updateUsers])

  // ページを離れるときにユーザーを削除
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userName.trim()) {
        removeUserFromRoom(roomId, userName.trim())
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (userName.trim()) {
        removeUserFromRoom(roomId, userName.trim())
      }
    }
  }, [userName, roomId])

  const handleCardSelect = (card: string | number) => {
    if (!userName.trim()) {
      alert('ユーザー名を入力してください')
      return
    }
    
    setSelectedCard(card)
    
    const vote: Vote = {
      userName: userName.trim(),
      value: card,
      timestamp: Date.now()
    }
    
    const storageKey = getStorageKey(roomId, userName.trim())
    localStorage.setItem(storageKey, JSON.stringify(vote))
    
    // 投票を再読み込み
    loadVotes()
  }

  const handleShowResults = () => {
    loadVotes()
    setShowResults(true)
  }

  const handleNewRound = () => {
    // このルームの全投票を削除
    const prefix = `planning-poker-${roomId}-`
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    setSelectedCard(null)
    setVotes([])
    setShowResults(false)
  }

  const handleCopyRoomId = async () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('コピーに失敗しました:', err)
      alert('コピーに失敗しました')
    }
  }

  const handleCreateNewRoom = () => {
    // 現在のルームから退出
    if (userName.trim()) {
      removeUserFromRoom(roomId, userName.trim())
    }
    
    const newRoomId = generateRoomId()
    setRoomId(newRoomId)
    setSelectedCard(null)
    setVotes([])
    setShowResults(false)
    setActiveUsers([])
  }

  const stats = calculateStats(votes)
  const userVote = votes.find(v => v.userName === userName.trim())

  // 各ユーザーの投票状況を計算
  const userVoteStatus = activeUsers.map(user => ({
    userName: user.userName,
    hasVoted: votes.some(vote => vote.userName === user.userName),
    isCurrentUser: user.userName === userName.trim()
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8 pb-4 border-b border-gray-200">
          <a href="../../" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
            <span className="mr-1">←</span>
            ふるじゅんの道具箱に戻る
          </a>
        </nav>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Planning Poker</h1>
          <p className="text-xl text-gray-600">
            チームで見積もりを共有しましょう
          </p>
        </div>

        {/* ルーム管理 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="あなたの名前を入力"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ルームID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomId}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={handleCopyRoomId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  {copied ? '✓ コピー済み' : '📋 コピー'}
                </button>
              </div>
            </div>
            <div>
              <button
                onClick={handleCreateNewRoom}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
              >
                新しいルーム
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ルームIDをコピーして、チームメンバーに共有してください
          </p>
        </div>

        {/* 入室中のユーザー一覧 */}
        {userName.trim() && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              入室中のユーザー ({activeUsers.length}人)
            </h3>
            {activeUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">まだ誰も入室していません</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeUsers.map((user) => (
                  <div
                    key={user.userName}
                    className={`px-4 py-2 rounded-lg ${
                      user.userName === userName.trim()
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.userName}
                    {user.userName === userName.trim() && ' (あなた)'}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!showResults ? (
          /* 投票画面 */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              カードを選択してください
            </h2>

            {/* 投票状況 */}
            {userName.trim() && activeUsers.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  投票状況 ({userVoteStatus.filter(u => u.hasVoted).length}/{activeUsers.length}人投票済み)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userVoteStatus.map((status) => (
                    <div
                      key={status.userName}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                        status.hasVoted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      } ${
                        status.isCurrentUser ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      {status.hasVoted ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-yellow-600">⏱</span>
                      )}
                      <span className={`text-sm font-medium ${
                        status.isCurrentUser ? 'font-semibold' : ''
                      }`}>
                        {status.userName}
                        {status.isCurrentUser && ' (あなた)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {FIBONACCI_CARDS.map((card) => {
                const isSelected = selectedCard === card
                const cardValue = typeof card === 'number' ? card : card
                
                return (
                  <button
                    key={card}
                    onClick={() => handleCardSelect(card)}
                    disabled={!userName.trim()}
                    className={`
                      aspect-square p-4 rounded-lg font-bold text-xl transition-all
                      ${isSelected
                        ? 'bg-blue-600 text-white scale-105 shadow-lg'
                        : 'bg-white border-2 border-gray-300 text-gray-800 hover:border-blue-500 hover:shadow-md'
                      }
                      ${!userName.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {cardValue}
                  </button>
                )
              })}
            </div>

            {userVote && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-center text-gray-700">
                  <span className="font-semibold">{userVote.userName}</span> さんの投票: 
                  <span className="text-2xl font-bold text-blue-600 ml-2">{userVote.value}</span>
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleShowResults}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                結果を表示
              </button>
              {votes.length > 0 && (
                <button
                  onClick={handleNewRound}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  新しいラウンドを開始
                </button>
              )}
            </div>
          </div>
        ) : (
          /* 結果表示画面 */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              投票結果
            </h2>

            {votes.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                まだ投票がありません
              </p>
            ) : (
              <>
                {/* 統計情報 */}
                {stats.numericVotes.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-1">平均</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.average.toFixed(1)}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-1">最小</div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.min}
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-1">最大</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.max}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-1">中央値</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.median.toFixed(1)}
                      </div>
                    </div>
                  </div>
                )}

                {/* 投票一覧 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    全員の投票 ({votes.length}人)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {votes.map((vote) => (
                      <div
                        key={`${vote.userName}-${vote.timestamp}`}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="font-semibold text-gray-800 mb-1">
                          {vote.userName}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {vote.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 投票分布の可視化 */}
                {stats.numericVotes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      投票分布
                    </h3>
                    <div className="space-y-2">
                      {Array.from(new Set(stats.numericVotes)).sort((a, b) => a - b).map((value) => {
                        const count = stats.numericVotes.filter(v => v === value).length
                        const percentage = (count / stats.numericVotes.length) * 100
                        
                        return (
                          <div key={value} className="flex items-center gap-3">
                            <div className="w-16 text-right font-semibold text-gray-700">
                              {value}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-sm text-gray-600">
                              {count}票
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      loadVotes()
                      setShowResults(false)
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    投票に戻る
                  </button>
                  <button
                    onClick={handleNewRound}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    新しいラウンドを開始
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

