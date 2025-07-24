import { useState } from 'react'
import { MODES, ModeKey, getRecommendations } from './questions'

type AppState = 'form' | 'results'

function App() {
  const [appState, setAppState] = useState<AppState>('form')
  const [formData, setFormData] = useState({
    feeling: '',
    purpose: '',
    time: ''
  })
  const [recommendations, setRecommendations] = useState<any[]>([])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.feeling && formData.purpose && formData.time) {
      const recs = getRecommendations(formData.feeling, formData.purpose, formData.time)
      setRecommendations(recs)
      setAppState('results')
    }
  }

  const copyToClipboard = async (modeKey: ModeKey) => {
    const mode = MODES[modeKey]
    const modeName = {
      kpt: 'KPT法',
      ywt: 'YWT法', 
      fourF: '4F法',
      fourLs: '4L\'s法',
      gibbs: 'Gibbs振り返りサイクル',
      simple: 'What-So What-Now What',
      positive: '4行日記法'
    }[modeKey]

    const copyText = `【${modeName} 振り返りシート】

${mode.questions.map((q, i) => `${i + 1}. ${q}？


`).join('')}
---
実施日:     /   /     所要時間: 約   分`

    try {
      await navigator.clipboard.writeText(copyText)
      alert('クリップボードにコピーしました！📋')
    } catch (err) {
      console.error('コピーに失敗しました:', err)
    }
  }

  const resetForm = () => {
    setAppState('form')
    setFormData({ feeling: '', purpose: '', time: '' })
    setRecommendations([])
  }

  // 診断フォーム画面
  if (appState === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">振り返り執事</h1>
            <p className="text-xl text-gray-600">
              あなたに最適な振り返り手法をご提案いたします
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              現在の状況をお聞かせください
            </h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-8">
              {/* 気分選択 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">💭 今の気分は？</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'モヤモヤしてる', '充実してる', '感情的になってる', '混乱してる',
                    '落ち込み気味', 'さっぱりしたい', '疲れ気味'
                  ].map((feeling) => (
                    <label key={feeling} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name="feeling"
                        value={feeling}
                        checked={formData.feeling === feeling}
                        onChange={(e) => setFormData({...formData, feeling: e.target.value})}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{feeling}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 目的選択 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">🎯 何をしたい？</h3>
                <div className="space-y-2">
                  {[
                    '問題解決したい',
                    '学びを抽出したい', 
                    '感情も含めて整理したい',
                    '多角的に分析したい',
                    '体系的に深く考えたい',
                    'シンプルに整理したい',
                    'ポジティブに振り返りたい'
                  ].map((purpose) => (
                    <label key={purpose} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name="purpose"
                        value={purpose}
                        checked={formData.purpose === purpose}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        className="mr-3 mt-1"
                      />
                      <span className="text-gray-700">{purpose}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 時間選択 */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">⏰ どのくらい時間をかけたい？</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['5-10分', '15-30分', '30-45分'].map((time) => (
                    <label key={time} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name="time"
                        value={time}
                        checked={formData.time === time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!formData.feeling || !formData.purpose || !formData.time}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                おすすめの振り返り手法を見る ✨
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // 結果表示画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">あなたにおすすめの振り返り手法</h1>
          <p className="text-gray-600">最適度の高い順に3つご提案いたします</p>
        </div>

        <div className="space-y-6 mb-8">
          {recommendations.slice(0, 3).map((rec, index) => {
            const modeKey = rec.key as ModeKey
            const mode = MODES[modeKey]
            const modeName = {
              kpt: 'KPT法',
              ywt: 'YWT法', 
              fourF: '4F法',
              fourLs: '4L\'s法',
              gibbs: 'Gibbs振り返りサイクル',
              simple: 'What-So What-Now What',
              positive: '4行日記法'
            }[modeKey]

            return (
              <div key={modeKey} className="bg-white rounded-xl shadow-lg p-6 relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    #{index + 1} おすすめ
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{modeName}</h3>
                <div className="text-gray-600 mb-4">
                  ⏰ {mode.time} | 💭 {mode.feeling}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">{mode.purpose}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">📝 振り返り項目:</h4>
                  <ul className="space-y-2">
                    {mode.questions.map((q, i) => (
                      <li key={i} className="text-gray-700">
                        {i + 1}. {q}？
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => copyToClipboard(modeKey)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  📋 この手法の振り返りシートをコピー
                </button>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={resetForm}
            className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            ← 最初からやり直す
          </button>
        </div>
      </div>
    </div>
  )
}

export default App 