import Link from 'next/link'

export default function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    研究分野: [
      { name: '風俗体験談', href: '/fuzoku' },
      { name: 'FANZA動画レビュー', href: '/fanza' },
      { name: '業界研究', href: '/research' },
    ],
    研究所情報: [
      { name: '研究所について', href: '/about' },
      { name: '研究方針', href: '/about/policy' },
      { name: '研究実績', href: '/about/achievements' },
    ],
    法的情報: [
      { name: '利用規約', href: '/terms' },
      { name: 'プライバシーポリシー', href: '/privacy' },
      { name: '免責事項', href: '/disclaimer' },
    ],
    サポート: [
      { name: 'お問い合わせ', href: '/contact' },
      { name: 'サイトマップ', href: '/sitemap' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* メインフッターコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 重要な注意事項 */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4">
            <h4 className="text-red-200 font-semibold mb-2">重要な注意事項</h4>
            <ul className="text-red-100 text-sm space-y-1">
              <li>• 本サイトは18歳未満の方の閲覧を禁止しています</li>
              <li>• 掲載内容は個人的な体験・感想に基づくものです</li>
              <li>• 風俗店舗の利用は自己責任で行ってください</li>
              <li>• 当サイトは適切な法的コンプライアンスを遵守しています</li>
            </ul>
          </div>
        </div>

        {/* 研究所情報 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">研</span>
            </div>
            <h2 className="text-xl font-bold">高山まさあきの夜遊び研究所</h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            実体験に基づく客観的な分析と信頼できる情報提供を通じて、
            大人の夜遊び文化を研究しています。
          </p>
        </div>

        {/* アフィリエイト表示 */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            ※ 当サイトは収益化のためアフィリエイトプログラムを利用しています
          </p>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} 高山まさあきの夜遊び研究所. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            このサイトは学術的・教育的な目的で運営されています
          </p>
        </div>
      </div>
    </footer>
  )
}