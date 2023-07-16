/* global chrome */
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
import './index.css';

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
    const [addInstanceError, setAddInstanceError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const location = useLocation();

    useEffect(() => {
        // ローカルストレージからMastodonインスタンスのURLを取得
        const savedPreferredInstance =
            localStorage.getItem('preferredInstance');
        if (savedPreferredInstance) {
            setMastodonInstance(savedPreferredInstance);
        } else if (instancesList.length > 0) {
            setMastodonInstance(instancesList[0]);
        }
    }, [location, instancesList]);

    useEffect(() => {
        const savedInstances = JSON.parse(
            localStorage.getItem('instancesList'),
        );
        if (!savedInstances || savedInstances.length === 0)
            setShowAddForm(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('instancesList', JSON.stringify(instancesList));
    }, [instancesList]);

    const handleAddInstance = () => {
        handleAddNewInstance(
            newMastodonInstance,
            instancesList,
            setInstancesList,
            setAddInstanceError,
            setSuccessMessage,
        );
        setMastodonInstance(newMastodonInstance);
        setNewMastodonInstance('');
        //localStorage.setItem('instancesList', JSON.stringify(instancesList));
        localStorage.setItem('preferredInstance', newMastodonInstance);
    };

    const handleShare = () => {
        // 指定したURLにジャンプ
        const shareText = encodeURIComponent(combinedValue);
        window.open(
            `https://${mastodonInstance}/share?text=${shareText}`,
            '_blank',
        );
    };

    const handleButtonClick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const title = activeTab.title;
            const url = activeTab.url;
            setCombinedValue(`${title}\n${url}`);
            console.log(combinedValue);
        });
    };

    const handleCopyToClipboard = async () => {
        await navigator.clipboard.writeText(combinedValue);
    };

    return (
        <div className="items-center main-container">
            <div className="p-4">
                <h2 className="text-2xl font-bold flex items-center">
                    <BsPencilFill className="mr-1" />
                    シェアする内容
                </h2>
                <textarea
                    className="text-base w-full mt-2 p-2 border rounded-md"
                    rows={6}
                    value={combinedValue}
                    onChange={(e) => setCombinedValue(e.target.value)}
                />
                <button
                    onClick={handleButtonClick}
                    className="mt-2 mb-2 py-2 px-4 mr-2 bg-lime-500 text-white rounded"
                >
                    現在のページを取得
                </button>
                <button
                    onClick={handleCopyToClipboard}
                    className="mt-2 mb-2 py-2 px-4 bg-orange-500 text-white rounded"
                >
                    クリップボードにコピー
                </button>
                {instancesList.length > 0 ? (
                    <>
                        <h2 className="text-lg mt-4 flex items-center">
                            <BsMastodon className="mr-1" />
                            共有するインスタンスを選択
                        </h2>

                        <select
                            className="text-base w-full mt-2 p-2 border rounded-md"
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
                                className="text-base mt-4 mb-2 text-blue-600 cursor-pointer hover:underline"
                                onClick={() => setShowAddForm(true)}
                            >
                                リストにありませんか？
                            </p>
                        ) : (
                            <p
                                className="text-base mt-4 mb-2 text-blue-600 cursor-pointer hover:underline"
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
                                className="text-base flex-grow mr-2 p-2 border rounded-md"
                                placeholder="mastodon.social"
                                value={newMastodonInstance}
                                onChange={(e) =>
                                    setNewMastodonInstance(e.target.value)
                                }
                            />
                            <button
                                className="text-base p-2 bg-blue-500 text-white rounded-md"
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
                    className="text-base w-full mt-4 p-2 bg-blue-500 text-white rounded-md"
                    onClick={handleShare}
                >
                    共有
                </button>
                <Link to="/settings">
                    <p className="text-base mt-2 text-gray-500 hover:underline flex items-center">
                        <BsGearFill className="mr-1" />
                        設定
                    </p>
                </Link>
                <div className="flex justify-center">
                    <a
                        href="https://github.com/naaaaaaaaaaaf/mastoshare-for-chrome"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-gray-500 hover:underline flex items-center"
                    >
                        <BsGithub className="mr-1" />
                        Mastoshare Firefox Extension v{version}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ShareComponent;
