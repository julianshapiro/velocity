## Velocity 1.3.1

**Docs**
[http://VelocityJS.org](http://velocityjs.org)

**News**
WhatsApp, Tumblr, Windows, Samsung, Uber, and thousands of other companies rely on Velocity. Visit [Libscore.com](http://libscore.com/#$.Velocity) to see which sites use Velocity on their homepage.

> Hi folks, I have some exciting news to share. Julian has graciously offered and I have accepted to become the lead maintainer for Velocity. I'm really excited to be working closely with and learning from him in order to transition this project onto my plate. I remember when Julian started working on Velocity (locked away in his apartment — a few blocks away from me). Then later when he first announced it publicly. And finally when it exploded in growth from 0 to what it is today. I hope to bring that same enthusiasm, energy, and skill to it. I am honored to be taking it on. Looking forward to working on it along with the rest of the contributors.
>
>  — **Message from [@kvirani](https://github.com/kvirani) [August 22, 2016]**

**React Plugin**
Announcement: https://fabric.io/blog/introducing-the-velocityreact-library
Repo: https://github.com/twitter-fabric/velocity-react
NPM: https://www.npmjs.com/package/velocity-react

**Quickstart**
Velocity (CDN, choose one of them):  
```html
<script src="//cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script src="//cdn.jsdelivr.net/velocity/1.2.3/velocity.min.js"></script>
```

Velocity UI pack (CDN, choose one of them):  
```html
<script src="//cdn.jsdelivr.net/velocity/1.2.3/velocity.ui.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.ui.min.jss"></script>
```

Package managers:  
_npm:_ `npm install velocity-animate`
_bower:_ `bower install velocity`

**Questions or Problems?**
Ask on [StackOverflow](http://stackoverflow.com/tags/velocity.js) (make sure you add the `velocity.js` and `javascript` tags).

### Updates

- **1.3.0**: Code cleanup - no breaking changes known.
- **1.2.0**: [Custom tweens](http://VelocityJS.org/#progress). [Custom easings](http://VelocityJS.org/#easing). ["Finish" command](http://VelocityJS.org/#finish). See [commit log](https://github.com/julianshapiro/velocity/commit/2a28e3812c6fe9262244ed3b6d41d12ae9a107c6) for more.
- **1.0.0**: File name changed to `velocity.js`. Read [VelocityJS.org/#dependencies](http://VelocityJS.org/#dependencies).
- **0.1.0**: `stop` now stops animations *immediately* (instead of only clearing the remainder of the animation queue). No other backwards-incompatible changes were made.

### Learn

- **Motion design**: [smashingmagazine.com/2014/06/18/faster-ui-animations-with-velocity-js](http://smashingmagazine.com/2014/06/18/faster-ui-animations-with-velocity-js)
- **Animating without jQuery**: [smashingmagazine.com/2014/09/04/animating-without-jquery](http://www.smashingmagazine.com/2014/09/04/animating-without-jquery/)
- **Performance comparisons**: [davidwalsh.name/css-js-animation](http://davidwalsh.name/css-js-animation)
- **Workflow**: [css-tricks.com/improving-ui-animation-workflow-velocity-js](http://css-tricks.com/improving-ui-animation-workflow-velocity-js)

### Comparisons

- **CSS transitions** are meant for simple interface flourishes.
- **jQuery's $.animate()** is slow and poorly-equipped for motion design.
- **Velocity** is a fast, feature-rich standalone alternative to jQuery's $.animate().

====

[MIT License](LICENSE.md). © Julian Shapiro (http://twitter.com/shapiro).
[Stripe](https://stripe.com/blog/stripe-open-source-retreat) sponsors Velocity's development. [BrowserStack](http://www.browserstack.com/) provides testing services.