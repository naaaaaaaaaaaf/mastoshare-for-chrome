import React, { useEffect, useState } from 'react';
import { useAddNewInstance } from './useAddNewInstance';
import packageJson from '../package.json';
import { Link } from 'react-router-dom';
import {
    BsFillGearFill,
    BsMastodon,
    BsPlusLg,
    BsStarFill,
    BsGithub,
} from 'react-icons/bs';

function SettingsComponent() {
    const { version } = packageJson;
    const { handleAddNewInstance } = useAddNewInstance();
    const [instancesList, setInstancesList] = useState([]);
    const [newMastodonInstance, setNewMastodonInstance] = useState('');
    const [preferredInstance, setPreferredInstance] = useState('');
    const [addInstanceError, setAddInstanceError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const savedInstances = JSON.parse(
            localStorage.getItem('instancesList'),
        );
        if (savedInstances) {
            setInstancesList(savedInstances);
        }

        const savedPreferredInstance =
            localStorage.getItem('preferredInstance');
        if (savedPreferredInstance) {
            setPreferredInstance(savedPreferredInstance);
        }
    }, []);

    const handleAddInstance = () => {
        handleAddNewInstance(
            newMastodonInstance,
            instancesList,
            setInstancesList,
            setAddInstanceError,
            setSuccessMessage,
        );
        // フォームの入力フィールドをクリアする
        setNewMastodonInstance('');
    };

    const handleRemoveInstance = (instanceToRemove) => {
        const updatedInstances = instancesList.filter(
            (instance) => instance !== instanceToRemove,
        );
        setInstancesList(updatedInstances);
        localStorage.setItem('instancesList', JSON.stringify(updatedInstances));

        if (instanceToRemove === preferredInstance) {
            setPreferredInstance('');
            localStorage.removeItem('preferredInstance');
        }
    };
    const handleSetPreferredInstance = (instance) => {
        setPreferredInstance(instance);
        localStorage.setItem('preferredInstance', instance);
    };

    return (
        <div className="items-center main-container">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 flex items-center">
                    <BsFillGearFill className="mr-1" />
                    設定
                </h1>

                <h2 className="text-xl mb-2 flex items-center">
                    <BsMastodon className="mr-1" />
                    インスタンス
                </h2>
                <table className="table-auto">
                    <tbody>
                        {instancesList.map((instance, index) => (
                            <tr key={index}>
                                <td>
                                    <span className="text-base mr-4">
                                        {instance}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="mr-2 bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() =>
                                            handleRemoveInstance(instance)
                                        }
                                    >
                                        削除
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() =>
                                            handleSetPreferredInstance(instance)
                                        }
                                    >
                                        優先に設定
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3 className="text-lg mt-4 flex items-center">
                    <BsPlusLg className="mr-1" />
                    インスタンスを追加する
                </h3>
                {addInstanceError && (
                    <p className="text-red-500">{addInstanceError}</p>
                )}
                {successMessage && (
                    <p className="text-green-500">{successMessage}</p>
                )}
                <div className="flex items-center mt-2">
                    <input
                        type="text"
                        className="text-base flex-grow mr-2 p-2 border rounded-md"
                        placeholder="Add new instance"
                        value={newMastodonInstance}
                        onChange={(e) => setNewMastodonInstance(e.target.value)}
                    />
                    <button
                        className="text-base p-2 bg-blue-500 text-white rounded-md"
                        onClick={handleAddInstance}
                    >
                        追加
                    </button>
                </div>

                <h2 className="text-xl mt-4 mb-2 flex items-center">
                    <BsStarFill className="mr-1" />
                    優先インスタンス
                </h2>
                <p className="text-base">{preferredInstance}</p>
                <Link to="/index.html">
                    <button className="text-base w-full mt-4 p-2 bg-blue-500 text-white rounded-md">
                        戻る
                    </button>
                </Link>
                <div className="flex justify-center">
                    <a
                        href="https://github.com/naaaaaaaaaaaf/mastoshare-for-chrome"
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

export default SettingsComponent;
