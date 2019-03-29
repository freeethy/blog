# google protocol buffers

(Protocol Buffers)[https://developers.google.com/protocol-buffers/docs/overview#what-are-protocol-buffers]

## Introduction

Protocol buffers are a language-neutral, platform-neutral, extensible way of serializing structured data for use in communications protocols, data storage, and more.

### What are protocol buffers?

Protocol buffers are a flexible, efficient, automated mechanism for serializing structured data – think XML, but smaller, faster, and simpler. You define how you want your data to be structured once, then you can use special generated source code to easily write and read your structured data to and from a variety of data streams and using a variety of languages. You can even update your data structure without breaking deployed programs that are compiled against the "old" format.

### How do they work?

You specify how you want the information you're serializing to be structured by defining protocol buffer message types in .proto files. Each protocol buffer message is a small logical record of information, containing a series of name-value pairs.

## FAQ

(Frequently Asked Questions){https://developers.google.com/protocol-buffers/docs/faq}

### Why did you release protocol buffers?

There are several reasons:

- Protocol buffers are used by practically everyone inside Google. We have many other projects we would like to release as open source that use protocol buffers, so to do this, we needed to release protocol buffers first. In fact, bits of the technology have already found their way into the open – if you dig into the code for Google AppEngine, you might find some of it.
- We would like to provide public APIs that accept protocol buffers as well as XML, both because it is more efficient and because we're just going to convert that XML to protocol buffers on our end anyway.
- We thought that people outside Google might find protocol buffers useful.
- Getting protocol buffers into a form we were happy to release was a fun 20% project.

## Similar Technologies

### How do protocol buffers differ from XML? Why not just use XML?

Protocol buffers have many advantages over XML for serializing structured data. Protocol buffers:

- are simple
- are 3 to 10 times smaller
- are 20 to 100 times faster
- are less ambiguous
- generate data access classes that are easier to use programmatically

### How do protocol buffers differ from ASN.1, COM, CORBA, Thrift, etc?

We think all of these systems have strengths and weaknesses. Google relies on protocol buffers internally and they are a vital component of our success, but that doesn't mean they are the ideal solution for every problem. You should evaluate each alternative in the context of your own project.

It is worth noting, though, that several of these technologies define both an interchange format and an RPC (remote procedure call) protocol. Protocol buffers are just an interchange format. They could easily be used for RPC – and, indeed, they do have limited support for defining RPC services – but they are not tied to any one RPC implementation or protocol.

## JavaScript Generated Code

(JavaScript Generated Code)[https://developers.google.com/protocol-buffers/docs/reference/javascript-generated]
