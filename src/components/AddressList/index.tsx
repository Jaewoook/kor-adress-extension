import React from "react";
import styled from "styled-components";
import { Collapse, Typography } from "antd";
import { AddressData } from "../../AddressManager";
import { ClickToCopyText } from "../ClickToCopyText";
import "./AddressList.css";

interface Props {
    data: AddressData[];
    showEngAddr: boolean;
    showRoadAddr: boolean;
    showLegacyAddr: boolean;
}

const EmptyText = styled(Typography.Paragraph)`
    text-align: center;
    margin-top: 2em;
    margin-bottom: 2em !important;
    color: rgba(0, 0, 0, 0.6) !important;
    > span {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.3) !important;
    }
`;

export const AddressList = (props: Props) => {
    const { data, showEngAddr, showRoadAddr, showLegacyAddr } = props;
    if (!data || !data.length) {
        return <EmptyText type="secondary">
            검색 결과가 없습니다.<br />
            <span>(검색어 예시: 강남대로, 자양동, 초성 검색 가능)</span>
        </EmptyText>;
    }
    return (
        <Collapse bordered={false} defaultActiveKey={[0]}>
            {data.map((row, i) => (
                <Collapse.Panel key={i} header={row.roadAddr}>
                    <div>
                        <Typography.Paragraph className="addr-label">우편번호:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText>
                                {row.zipNo}
                            </ClickToCopyText>
                        </div>
                    </div>
                    {showRoadAddr ? <div>
                        <Typography.Paragraph className="addr-label">도로명주소:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText>
                                {row.roadAddr}
                            </ClickToCopyText>
                        </div>
                    </div> : null}
                    {showLegacyAddr ? <div>
                        <Typography.Paragraph className="addr-label">지번주소:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText>
                                {row.jibunAddr}
                            </ClickToCopyText>
                        </div>
                    </div> : null}
                    {showEngAddr ? <div>
                        <Typography.Paragraph className="addr-label">영문주소:</Typography.Paragraph>
                        <div>
                            <ClickToCopyText>
                                {row.engAddr}
                            </ClickToCopyText>
                        </div>
                    </div> : null}
                </Collapse.Panel>
            ))}
        </Collapse>
    );
};
