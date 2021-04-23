import axios from "axios";
import React, { useState, useEffect } from "react";
import { Divider, Input, Select, Button } from "antd";
import "antd/dist/antd.css";
import "./App.css";

const CURRENCY = ["USD", "BYN", "EUR", "PLN"];

function App() {
  const [firstInputValue, setFirstInputValue] = useState("");
  const [firstSelectValue, setFirstSelectValue] = useState(CURRENCY[1]);
  const [secondInputValue, setSecondInputValue] = useState("");
  const [secondSelectValue, setSecondSelectValue] = useState(CURRENCY[0]);
  const [firstToSecond, setFirstToSecond] = useState(0);
  const [secondToFirst, setSecondToFirst] = useState(0);

  const handleFirstInputChange = (e) => {
    setFirstInputValue(isNaN(+e.target.value) ? 0 : e.target.value);
    setSecondInputValue(
      isNaN(+e.target.value) ? 0 : (e.target.value * firstToSecond).toFixed(2)
    );
  };

  const handleSecondInputChange = (e) => {
    setSecondInputValue(isNaN(+e.target.value) ? 0 : e.target.value);
    setFirstInputValue(
      isNaN(+e.target.value) ? 0 : (e.target.value * secondToFirst).toFixed(2)
    );
  };

  const handleFirstSelectChange = (e) => {
    setFirstSelectValue(e);
  };

  const handleSecondSelectChange = (e) => {
    setSecondSelectValue(e);
  };

  const handleCurrencySwap = (first, second) => {
    setFirstSelectValue(second);
    setSecondSelectValue(first);
  };

  useEffect(() => {
    axios
      .get(
        `https://free.currconv.com/api/v7/convert?q=${firstSelectValue}_${secondSelectValue},${secondSelectValue}_${firstSelectValue}&compact=ultra&apiKey=ff52da585a54525916f7`
      )
      .then((res) => {
        setFirstToSecond(res.data[`${firstSelectValue}_${secondSelectValue}`]);
        setSecondToFirst(res.data[`${secondSelectValue}_${firstSelectValue}`]);
        setSecondInputValue(
          (
            +firstInputValue *
            res.data[`${firstSelectValue}_${secondSelectValue}`]
          ).toFixed(2)
        );
      });
    // eslint-disable-next-line
  }, [firstSelectValue, secondSelectValue]);

  return (
    <div className="wrapper">
      <div className="second-wrapper">
        <div className="input-group">
          <Input value={firstInputValue} onChange={handleFirstInputChange} />
          <Select
            onChange={handleFirstSelectChange}
            value={CURRENCY.find((item) => item === firstSelectValue)}
          >
            {CURRENCY.map((item, index) => {
              return (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <Button
          type="primary"
          onClick={() =>
            handleCurrencySwap(firstSelectValue, secondSelectValue)
          }
        >
          ⇄
        </Button>
        <div className="input-group">
          <Input value={secondInputValue} onChange={handleSecondInputChange} />
          <Select
            onChange={handleSecondSelectChange}
            value={CURRENCY.find((item) => item === secondSelectValue)}
          >
            {CURRENCY.map((item, index) => {
              return (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>
      <Quotes />
    </div>
  );
}

const Quotes = () => {
  const [quoteText, setText] = useState("Loading...");
  const [authorName, setAuthor] = useState("");

  useEffect(() => {
    axios.get("https://api.quotable.io/random").then((res) => {
      setText(res.data.content);
      setAuthor(res.data.author);
    });
  }, []);

  return (
    <div>
      <p>{quoteText}</p>
      <Divider orientation="right">{authorName}</Divider>
    </div>
  );
};

export default App;
