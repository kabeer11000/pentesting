import React from "react";
import { Heading, Button, SubHeading } from "../components";
import { postMessage, getUser } from "./apis";
import { showToolTip } from "./utils";
var URL = require("url-parse");

export class PostMessage extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      requestorId: this.props.requestorId,
      message: "",
      name: this.props.name,
      processing: true,
      processingMessage: "Fetching Details"
    };

    getUser(this.props.requestorId)
      .then(a => {
        const name = a.name || "";
        this.setState({ processing: false });
        this.setState({
          name: name.charAt(0).toUpperCase() + name.slice(1)
        });
      })
      .catch(() => (window.location.href = "/"));
  }

  onClick() {
    const url = new URL(window.location.href);
    const userId = (url.pathname || "").replace("/", "");
    if (!userId) {
      return;
    }
    if (!this.state.message) {
      showToolTip();
      return;
    }
    postMessage(userId, this.state.message).then(() => {
      this.setState({ processing: false, submitted: true });
    });

    this.setState({
      processing: true,
      processingMessage: "Submitting Message"
    });
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    if (!this.state.requestorId) {
      return;
    }
    if (this.state.submitted) {
      return (
        <>
          <Heading label="Message Sent" />
          <div className="mt-3">
            <SubHeading
              label={`Do Not tell ${this.state.name
                } that you have sent the message.`}
            />
          </div>
          <div className="w-2/3 md:w-1/3  mx-auto flex flex-col">
            <div className="mt-5 mb-3 self-center">
              <Button
                label="Register Now"
                onClick={() => (window.location.href = "/")}
              />
            </div>
            <div className="mb-3">
              <Button
                label="Send another message"
                onClick={e => window.location.reload()}
              />
            </div>
          </div>
          <div className="mx-4">
            <Toc />
          </div>
        </>
      );
    }
    if (this.state.processing) {
      return (
        <>
          <Heading label="Secret Message Book" />
          <SubHeading label={this.state.processingMessage} />
          <div className="mt-2 flex justify-center">
            <img src="/loading.svg" alt="wait" />
          </div>
        </>
      );
    }

    const url = new URL(window.location.href);
    const userId = (url.pathname || "").replace("/msg/", "").replace("/", "");
    if (!userId) {
      return;
    }

    return (
      <>
        <SubHeading label="Send Secret Message to" />
        <div className="mt-1">
          <Heading label={`${this.state.name}`} />
        </div>
        <div className="my-4 w-4/5 mx-auto text-sm text-gray-700">
          <div className="bullets">
            <ol className="text-left list-disc">
              <li>
                {`${this.state.name} will never know who sent this message`}
              </li>
            </ol>
          </div>
        </div>
        <div className="mx-4">
          <textarea
            value={this.state.message}
            onChange={this.handleChange}
            data-emojiable="true"
            className="w-full border-2 border-gray-300 rounded-lg p-3"
            rows="4"
            placeholder="Write Secret Message"
          />
          <div className="my-3">
            <Button label="Submit" onClick={this.onClick} />
          </div>
          <Toc />
        </div>
      </>
    );
  }
}

const Toc = () => {
  return (
    <div className="mt-3">
      <SubHeading label="Terms of use" />
      <ul className="list-disc text-left">
        <li>Please Don't send threat or harmful messages.</li>
        <li>You can send as many messages you want, but Don't spam</li>
        <li>
          Create your account & share it with friends to get anonymous feedback
        </li>
        <li>We use Cookies in order to make user experience better.</li>
      </ul>
    </div>
  );
};
