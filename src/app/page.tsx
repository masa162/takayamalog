export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            高山まさあきの夜遊び研究所
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            実体験に基づく信頼できる情報をお届けします
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-8">
            ⚠️ 18歳未満の方は閲覧できません
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="research-card">
            <div className="research-badge bg-red-100 text-red-800 mb-4">
              風俗体験談
            </div>
            <h3 className="research-heading text-lg">店舗型風俗・デリヘル</h3>
            <p className="research-text">
              実際の利用体験に基づいた詳細なレポートを提供します。
            </p>
          </div>

          <div className="research-card">
            <div className="research-badge bg-green-100 text-green-800 mb-4">
              FANZA動画レビュー
            </div>
            <h3 className="research-heading text-lg">動画作品分析</h3>
            <p className="research-text">
              新作動画の詳細レビューと評価を研究員が分析します。
            </p>
          </div>

          <div className="research-card">
            <div className="research-badge bg-purple-100 text-purple-800 mb-4">
              業界研究
            </div>
            <h3 className="research-heading text-lg">トレンド分析</h3>
            <p className="research-text">
              業界の最新動向と市場分析を定期的にレポートします。
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            研究所について
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                研究方針
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 実体験に基づく客観的な分析</li>
                <li>• 読者に役立つ実用的な情報提供</li>
                <li>• 業界の健全な発展への貢献</li>
                <li>• 法的・倫理的配慮の徹底</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                研究実績
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 風俗ライター歴8年</li>
                <li>• 年間300本以上の動画レビュー</li>
                <li>• 全国主要都市での取材実績</li>
                <li>• 業界関係者との信頼関係</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-600 rounded-lg">
            <span className="mr-2">🚧</span>
            現在開発中です - Phase 1.2 Supabase設定完了
          </div>
        </div>
      </div>
    </div>
  )
}
