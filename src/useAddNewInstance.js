
export const useAddNewInstance = () => {
    const handleAddNewInstance = async (
        newMastodonInstance,
        instancesList,
        setInstancesList,
        setAddInstanceError,
        setSuccessMessage,
    ) => {
        try {
            const response = await fetch(
                `https://${newMastodonInstance}/api/v1/instance`,
            );
            const data = await response.json();

            if (parseFloat(data.version) < 1.6) {
                setAddInstanceError('Mastodonのバージョンが1.6未満です。');
                setSuccessMessage(null);
                return;
            } else {
                setAddInstanceError(null);
                const updatedInstancesList = [
                    ...instancesList,
                    newMastodonInstance,
                ];
                setInstancesList(updatedInstancesList);
                localStorage.setItem(
                    'instancesList',
                    JSON.stringify(updatedInstancesList),
                );
                setSuccessMessage('インスタンスを追加しました。');
            }
        } catch {
            setAddInstanceError('インスタンスの追加に失敗しました。');
            setSuccessMessage(null);
        }
    };
    return { handleAddNewInstance };
};
