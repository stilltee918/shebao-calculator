'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [uploadingCities, setUploadingCities] = useState(false);
  const [uploadingSalaries, setUploadingSalaries] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const router = useRouter();

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleCitiesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCities(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-cities', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(`城市数据上传成功，共${result.count}条记录`, 'success');
      } else {
        showMessage(result.error || '上传失败', 'error');
      }
    } catch (error) {
      showMessage('上传过程中发生错误', 'error');
    } finally {
      setUploadingCities(false);
      e.target.value = '';
    }
  };

  const handleSalariesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSalaries(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-salaries', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(`工资数据上传成功，共${result.count}条记录`, 'success');
      } else {
        showMessage(result.error || '上传失败', 'error');
      }
    } catch (error) {
      showMessage('上传过程中发生错误', 'error');
    } finally {
      setUploadingSalaries(false);
      e.target.value = '';
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setMessage('');

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        showMessage(`计算完成，共处理${result.count}名员工`, 'success');
        setTimeout(() => {
          router.push('/results');
        }, 2000);
      } else {
        showMessage(result.error || '计算失败', 'error');
      }
    } catch (error) {
      showMessage('计算过程中发生错误', 'error');
    } finally {
      setCalculating(false);
    }
  };

  const downloadTemplate = (type: 'cities' | 'salaries') => {
    const templates = {
      cities: [
        ['id', 'city_name', 'year', 'base_min', 'base_max', 'rate'],
        ['1', '佛山', '2024', '1900', '26421', '0.15']
      ],
      salaries: [
        ['id', 'employee_id', 'employee_name', 'month', 'salary_amount'],
        ['1', 'EMP001', '张三', '202401', '8000'],
        ['2', 'EMP001', '张三', '202402', '8000'],
        ['3', 'EMP002', '李四', '202401', '12000']
      ]
    };

    const csvContent = templates[type].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          数据上传与计算
        </h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* 城市标准上传 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">1. 上传城市社保标准</h2>
            <p className="text-gray-600 mb-4">
              上传包含佛山社保标准的Excel文件
            </p>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                选择文件
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleCitiesUpload}
                  className="hidden"
                  disabled={uploadingCities}
                />
              </label>
              <button
                onClick={() => downloadTemplate('cities')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                下载模板
              </button>
              {uploadingCities && (
                <span className="text-blue-600">上传中...</span>
              )}
            </div>
          </div>

          {/* 工资数据上传 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">2. 上传员工工资数据</h2>
            <p className="text-gray-600 mb-4">
              上传包含员工工资数据的Excel文件
            </p>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                选择文件
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleSalariesUpload}
                  className="hidden"
                  disabled={uploadingSalaries}
                />
              </label>
              <button
                onClick={() => downloadTemplate('salaries')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                下载模板
              </button>
              {uploadingSalaries && (
                <span className="text-blue-600">上传中...</span>
              )}
            </div>
          </div>

          {/* 执行计算 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">3. 执行计算并存储结果</h2>
            <p className="text-gray-600 mb-4">
              点击按钮开始计算每位员工的社保缴纳金额
            </p>
            <button
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {calculating ? '计算中...' : '执行计算并存储结果'}
            </button>
          </div>

          {/* 返回首页 */}
          <div className="text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}