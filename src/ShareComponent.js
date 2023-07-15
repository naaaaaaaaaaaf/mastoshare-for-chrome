import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAddNewInstance } from './useAddNewInstance';
import {
    BsPencilFill,
    BsMastodon,
    BsPlusLg,
    BsGearFill,
    BsGithub,
} from 'react-icons/bs';
import packageJson from '../package.json';

function ShareComponent() {
    const { handleAddNewInstance } = useAddNewInstance();
    const { version } = packageJson;
    const [showAddForm, setShowAddForm] = useState(false);
    const [combinedValue, setCombinedValue] = useState('');
    const [mastodonInstance, setMastodonInstance] = useState('');
    const [newMastodonInstance, setNewMastodonInstance] = useState('');
    const [instancesList, setInstancesList] = useState(() => {
        const savedInstancesList = localStorage.getItem('instancesList');
        return savedInstancesList ? JSON.parse(savedInstancesList) : [];
    });
    const [versionError] = useState(null);
    const [addInstanceError, setAddInstanceError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const location = useLocation();

    useEffect(() => {
        // ローカルストレージからMastodonインスタンスのURLを取得
        const savedInstances = JSON.parse(
            localStorage.getItem('instancesList'),
        );
        if (savedInstances) setInstancesList(savedInstances);
        const savedPreferredInstance =
            localStorage.getItem('preferredInstance');
        if (savedPreferredInstance) {
            setMastodonInstance(savedPreferredInstance);
        }
        setCombinedValue('');

        if (!savedInstances || savedInstances.length === 0) setShowAddForm(true);
    }, [location]);

    const handleAddInstance = () => {
        handleAddNewInstance(
            newMastodonInstance,
            instancesList,
            setInstancesList,
            setAddInstanceError,
            setSuccessMessage,
        );
        // 新しく追加したインスタンスを選択する
        setMastodonInstance(newMastodonInstance);
        // フォームの入力フィールドをクリアする
        setNewMastodonInstance('');
    };

    useEffect(() => {
        localStorage.setItem('instancesList', JSON.stringify(instancesList));
    }, [instancesList]);

    const handleShare = () => {
        if (!versionError) {
            // MastodonインスタンスのURLをローカルストレージに保存
            localStorage.setItem(
                'instancesList',
                JSON.stringify(instancesList),
            );

            // 指定したURLにジャンプ
            const shareText = encodeURIComponent(combinedValue);
            window.location.href = `https://${mastodonInstance}/share?text=${shareText}`;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-4 rounded-md shadow-md">
                <h2 className="text-2xl font-bold flex items-center">
                    <BsPencilFill className="mr-1" />
                    シェアする内容
                </h2>

                <textarea
                    className="w-full mt-2 p-2 border rounded-md"
                    rows={6}
                    value={combinedValue}
                    onChange={(e) => setCombinedValue(e.target.value)}
                />

                {instancesList.length > 0 ? (
                    <>
                        <h2 className="text-lg mt-4 flex items-center">
                            <BsMastodon className="mr-1" />
                            共有するインスタンスを選択
                        </h2>

                        <select
                            className="w-full mt-2 p-2 border rounded-md"
                            value={mastodonInstance}
                            onChange={(e) =>
                                setMastodonInstance(e.target.value)
                            }
                        >
                            {instancesList.map((instance, index) => (
                                <option key={index} value={instance}>
                                    {instance}
                                </option>
                            ))}
                        </select>
                        {!showAddForm ? (
                            <p
                                className="mt-4 mb-2 text-blue-600 cursor-pointer hover:underline"
                                onClick={() => setShowAddForm(true)}
                            >
                                リストにありませんか？
                            </p>
                        ) : (
                            <p
                                className="mt-4 mb-2 text-blue-600 cursor-pointer hover:underline"
                                onClick={() => setShowAddForm(false)}
                            >
                                フォームを隠す
                            </p>
                        )}
                    </>
                ) : null}

                {showAddForm && (
                    <>
                        <h3 className="text-lg flex items-center">
                            <BsPlusLg className="mr-1" />
                            インスタンスを追加する
                        </h3>
                        <div className="flex justify-between mt-2">
                            <input
                                className="flex-grow mr-2 p-2 border rounded-md"
                                placeholder="mastodon.social"
                                value={newMastodonInstance}
                                onChange={(e) =>
                                    setNewMastodonInstance(e.target.value)
                                }
                            />
                            <button
                                className="p-2 bg-blue-500 text-white rounded-md"
                                onClick={handleAddInstance}
                            >
                                追加
                            </button>
                        </div>
                    </>
                )}

                {addInstanceError && (
                    <p className="text-red-500">{addInstanceError}</p>
                )}
                {successMessage && (
                    <p className="text-green-500">{successMessage}</p>
                )}
                <button
                    className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md"
                    onClick={handleShare}
                >
                    共有
                </button>
                <Link to="/settings">
                    <p className="mt-2 text-gray-500 hover:underline flex items-center">
                        <BsGearFill className="mr-1" />
                        設定
                    </p>
                </Link>
                <div className="flex justify-center">
                    <a
                        href="https://github.com/naaaaaaaaaaaf/mastoshare"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-gray-500 hover:underline flex items-center"
                    >
                        <BsGithub className="mr-1" />
                        Mastoshare Chrome Extension v{version}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ShareComponent;