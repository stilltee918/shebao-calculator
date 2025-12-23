'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Result {
  id: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
  months_count: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        setMessage('获取结果失败');
      }
    } catch (error) {
      setMessage('获取结果时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleClearResults = async () => {
    if (!confirm('确定要清空所有计算结果吗？')) {
      return;
    }

    setClearing(true);
    try {
      const response = await fetch('/api/clear-results', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResults([]);
        setMessage('结果已清空');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || '清空失败');
      }
    } catch (error) {
      setMessage('清空过程中发生错误');
    } finally {
      setClearing(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['员工姓名', '年度月平均工资', '缴费基数', '公司缴纳金额', '数据月份数'];
    const rows = results.map(r => [
      r.employee_name,
      r.avg_salary.toFixed(2),
      r.contribution_base.toFixed(2),
      r.company_fee.toFixed(2),
      r.months_count
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `社保计算结果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            计算结果
          </h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              返回首页
            </Link>
            <Link
              href="/upload"
              className="text-blue-600 hover:text-blue-800"
            >
              上传数据
            </Link>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('失败') || message.includes('错误') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">暂无计算结果</p>
            <button
              onClick={() => router.push('/upload')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              上传数据并计算
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  社保缴纳明细
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={exportToCSV}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    导出CSV
                  </button>
                  <button
                    onClick={handleClearResults}
                    disabled={clearing}
                    className="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
                  >
                    {clearing ? '清空中...' : '清空结果'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        员工姓名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        年度月平均工资
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        缴费基数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        公司缴纳金额
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        备注
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.employee_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ¥{result.avg_salary.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ¥{result.contribution_base.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ¥{result.company_fee.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {result.months_count < 12 ? (
                            <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                              仅{result.months_count}个月数据，结果仅供参考
                            </span>
                          ) : (
                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded">
                              数据完整
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        合计
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ¥{results.reduce((sum, r) => sum + r.company_fee, 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {results.length}名员工
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>说明：</strong>
              </p>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>基于2024年佛山社保标准计算</li>
                <li>社保基数下限：¥1,900</li>
                <li>社保基数上限：¥26,421</li>
                <li>综合缴纳比例：15%</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}