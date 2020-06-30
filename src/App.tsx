import React from "react";
import "antd/dist/antd.css";
import "./App.css";
import {
    Button,
    Input,
    Layout,
    PageHeader,
    Spin,
} from "antd";
import { CheckCircleFilled, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { AddressData, AddressManager } from "./AddressManager";
import { AddressList } from "./components/AddressList";
import { getRuntime } from "./utils";
import { SettingsManager, Settings } from "./SettingsManager";

interface Props {
    settings: SettingsManager<Settings> | null;
    address: AddressManager;
}

export const App = (props: Props) => {
    const { settings, address } = props;
    const [searchValue, setSearchValue] = React.useState("");
    const [showLoading, setShowLoading] = React.useState(false);
    const [showEngAddr, setShowEngAddr] = React.useState(true);
    const [showRoadAddr, setShowRoadAddr] = React.useState(true);
    const [showLegacyAddr, setShowLegacyAddr] = React.useState(true);
    const [addressData, setAddressData] = React.useState<AddressData[]>([]);
    const [updatingSettings, setUpdatingSettings] = React.useState(false);

    const handleSearchValueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }, [setSearchValue]);

    const handleSearchClick = React.useCallback(() => {
        setShowLoading(true);

        address.search({
            countPerPage: "20",
            currentPage: "1",
            keyword: searchValue,
        })?.then((data) => {
            setAddressData(data);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setShowLoading(false);
        });
    }, [address, searchValue, setAddressData, setShowLoading]);

    const handleSearchOptionClick = React.useCallback((type: "eng" | "road" | "legacy") => async () => {
        if (updatingSettings) {
            return;
        }

        setUpdatingSettings(true);
        try {
            switch (type) {
                case "eng":
                    setShowEngAddr(!showEngAddr);
                    await settings?.updateSettings({
                        searchResult: { showEng: !showEngAddr },
                    });
                    break;
                case "road":
                    setShowRoadAddr(!showRoadAddr);
                    await settings?.updateSettings({
                        searchResult: { showRoad: !showRoadAddr },
                    });
                    break;
                case "legacy":
                    setShowLegacyAddr(!showLegacyAddr);
                    await settings?.updateSettings({
                        searchResult: { showLegacy: !showLegacyAddr },
                    });
                    break;
            }
        } finally {
            setUpdatingSettings(false);
        }
    }, [settings, showEngAddr, showRoadAddr, showLegacyAddr, updatingSettings, setShowEngAddr, setShowRoadAddr, setShowLegacyAddr, setUpdatingSettings]);

    React.useEffect(() => {
        if (getRuntime() === "extension") {
            settings?.once("ready", () => {
                console.log("Settings loaded", settings);
                const searchResult = settings?.settings?.searchResult;
                setShowEngAddr(searchResult?.showEng ?? false);
                setShowRoadAddr(searchResult?.showRoad ?? true);
                setShowLegacyAddr(searchResult?.showLegacy ?? true);

                if (settings.settings?.addressData?.length) {
                    setAddressData(settings.settings.addressData);
                    setSearchValue(settings.settings.prevSearchKey?.keyword ?? "");
                }
            });
        }
    }, [settings]);

    return (
        <Layout>
            <PageHeader
                title="주소검색"
                extra={[
                    <Button
                        key={1} type="link" disabled={updatingSettings}
                        icon={showEngAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}
                        onClick={handleSearchOptionClick("eng")}>
                            영문주소
                    </Button>,
                    <Button key={2} type="link" disabled={updatingSettings}
                        icon={showRoadAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}
                        onClick={handleSearchOptionClick("road")}>
                            도로명주소
                    </Button>,
                    <Button key={3} type="link" disabled={updatingSettings}
                        icon={showLegacyAddr ? <CheckCircleFilled /> : <CheckCircleOutlined />}
                        onClick={handleSearchOptionClick("legacy")}>
                            지번주소
                    </Button>,
                ]} />
            <Layout.Content style={{ padding: "10px" }}>
                <Input.Search
                    enterButton allowClear
                    placeholder="검색할 주소 입력"
                    value={searchValue}
                    loading={showLoading}
                    onChange={handleSearchValueChange}
                    onSearch={handleSearchClick} />
            </Layout.Content>
            <Layout.Content>
                <AddressList
                    data={addressData}
                    showEngAddr={showEngAddr}
                    showRoadAddr={showRoadAddr}
                    showLegacyAddr={showLegacyAddr} />
                {showLoading ? (
                    <Spin style={{ width: "100%", marginBottom: "30px" }} indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
                ) : null}
            </Layout.Content>
        </Layout>
    );
};
