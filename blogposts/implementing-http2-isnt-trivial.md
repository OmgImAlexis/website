---
title: Implementing HTTP/2 Isn't Trivial
author: Matt Holt
date: 2015-09-28 08:00:00+00:00
type: post
---

There's been a lot of interest in HTTP/2 lately, particularly the server push function. While it is certainly exciting to finally supersede the 16-year-old, plain text HTTP/1.1 protocol with a shiny, new binary protocol, it is important to remember that this transition will take time.

I would like to [make a few comments](https://twitter.com/mholt6/status/644584867112488960) regarding some of the current hype of HTTP/2 and answer some confusion. Recently, [NGINX Inc. announced](https://www.nginx.com/blog/nginx-plus-r7-released/) that their commercial offering, NGINX Plus, "provides a fully supported implementation of the new HTTP/2 web standard." Several of the responses on Twitter, Hacker News, etc., express some disappointment that it does not support a highly-touted feature of HTTP/2, server push:

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/bjornjohansen">@bjornjohansen</a> No HTTP/2 server-push support, so not really all that interesting.</p>&mdash; Daniel Aleksandersen (@Aeyoun) <a href="https://twitter.com/Aeyoun/status/644260508758089728">September 16, 2015</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

To be fair, Caddy does not have server push yet, either. And neither do most HTTP/2 servers. Allow me to suggest why.


## You Already Do Server Push (kind of)

"Server push" is a new feature in HTTP/2 that allows the web server to send resources to the client right away so it doesn't have to make separate requests to ask for them later. Sound familiar? You probably already do it on your site. It's effectively the same thing as inlining resources into your style sheets and HTML pages. Push still has some specific advantages (optimized client-side caching of resources, for instance) but the concept is similar.

Whenever you embed an image, script, or style sheet directly into your page, you save the client an extra HTTP 1.1 request (which amounts to many TCP-level round trips). Well, this is what server push does too.

So missing out on server push&mdash;at least for now&mdash;isn't that disappointing. If you consider the most significant features of HTTP/2 (binary format, stream multiplexing, header compression, and prioritization), server push is only mildly interesting in comparison.

In other words, server push is like the cherry on top to simplify your build process and abstract more of the network details away from web developers. (However, [it was pointed out to me](https://twitter.com/bagder/status/648851772585455616) that server push still has notable improvements on performance in some cases. Then again, [only marginal in others](http://blog.kazuhooku.com/2015/10/performance-of-http2-push-and-server.html).)


## Server Push is Hard

Another reason you don't see a lot of servers with server push yet is because it's [a hard function to implement](https://github.com/bradfitz/http2/pull/39) well. The HTTP/2 specification doesn't go into detail about how to implement server push, only how the protocol facilitates it.

The [spec says](https://httpwg.github.io/specs/rfc7540.html#PushRequests):

> HTTP/2 allows a server to pre-emptively send (or "push") responses (along with corresponding "promised" requests) to a client in association with a previous client-initiated request. This can be useful when the server knows the client will need to have those responses available in order to fully process the response to the original request.

The rest is all about the exchange between client and server.

So how does the server know what the client will need? Well, that's not in the spec. It's up to the server to take care of it and it's not obvious how best to do it. Further, clients can cache resources (but at least the specification addresses this).

How a web server determines what a client needs before the client knows&mdash;and in priority order&mdash;is seriously challenging, especially for general-purpose web servers which need to allow site owners to tune certain aspects for best performance and reliability. The heuristics for determining what to push and in what priority vary.

HTTP/2 is not a trivial protocol. In some ways, it is simpler than HTTP/1.1, but in other ways, it is vastly more complicated. The HTTP/2 protocol expects an implementation to have good algorithms to take full advantage of its efficiency.

HTTP/2 is still very young. With time, web servers (including Caddy) will support server push.


## HTTP/2 Server vs. HTTP/2 Implementation

To clarify, an HTTP/2 web server is not the same thing as an HTTP/2 implementation. For example, I have not implemented HTTP/2 myself. It's a complicated protocol and nobody, except perhaps its designers, have expertise with it yet. Caddy is not an implementation of HTTP/2, but it does serve HTTP/2, even if its implementation is incomplete. Caddy uses a Go implementation of HTTP/2 primarily by Brad Fitzpatrick, one of the Go Authors. It is anticipated that the package will be merged into the Go standard library as a mature HTTP/2 implementation for Go 1.6.


## HTTP/2 Can Be Even Faster

It's worth mentioning that most HTTP/2 still runs over TCP, which isn't always fast (even if it is very reliable). However, if you're using Google Chrome and accessing Google-owned sites, chances are you're getting an extra speed boost with [QUIC](https://www.chromium.org/quic), an experimental TCP replacement built on UDP. Things are looking good so far and QUIC may very well be the next standard of transport for the web in the coming years. As the QUIC specification is finalized and assuming an early, stable Go implementation exists, you can expect Caddy will be one of the first to support QUIC.


## You Can Already Use HTTP/2

Although Caddy doesn't yet have all the features available in HTTP/2, you can still take advantage of its speed and efficiency right now with your current, HTTP/1.1-enabled site. HTTP/2 is the default with Caddy and requires no tuning. We hope to keep it that way, although in the future we may add some optional knobs for power users who want to optimize Caddy for a special use case.

Try it out. Dozens of us have contributed to make Caddy the best possible web server experience, and we hope you'll enjoy it.
