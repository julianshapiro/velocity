# Velocity 1.5.2

## Docs
[http://VelocityJS.org](http://velocityjs.org)

## News
WhatsApp, Tumblr, Windows, Samsung, Uber, and thousands of other companies rely on Velocity. Visit [Libscore.com](http://libscore.com/#$.Velocity) to see which sites use Velocity on their homepage.

## React Plugin
Announcement: https://fabric.io/blog/introducing-the-velocityreact-library<br>
Repo: https://github.com/twitter-fabric/velocity-react<br>
NPM: https://www.npmjs.com/package/velocity-react

## Quickstart
### Velocity (CDN, choose one of them):
```html
<script src="//cdn.jsdelivr.net/npm/velocity-animate@1.5/velocity.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/velocity/1.5.2/velocity.min.js"></script>
```

### Velocity UI pack (CDN, choose one of them): 
```html
<script src="//cdn.jsdelivr.net/npm/velocity-animate@1.5/velocity.ui.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/velocity/1.5.2/velocity.ui.min.js"></script>
```

> Please note that JSDelivr will automatically supply the latest release, while CloudFlare needs to ask for a specific version.

### Package managers:
_npm:_ `npm install velocity-animate`<br>
_bower:_ `bower install velocity`

## Questions or Problems?
Ask on [StackOverflow](http://stackoverflow.com/tags/velocity.js) (make sure you add the `[velocity.js]` and `[javascript]` tags).

## Updates
- **[1.5](https://github.com/julianshapiro/velocity/compare/1.4.0...1.5.0)**: Bugfixes, IE9 compatibility fixes.
- **[1.4](https://github.com/julianshapiro/velocity/compare/1.3.0...1.4.0)**: Pause / Resume (per element or global).<br>
Forcefed string animation (just have matching number spaces) including unit conversions and colour names (ie `background:["rgba(red,0.1)", "blue"]`).
High resolution timers (animations should be slightly smoother).<br>
Various fixes including ticker (loading Velocity in a background window) and color handling.
- **[1.3](https://github.com/julianshapiro/velocity/compare/1.2.0...1.3.0)**: Code cleanup - no breaking changes known.
- **[1.2](https://github.com/julianshapiro/velocity/compare/1.1.0...1.2.0)**: [Custom tweens](http://VelocityJS.org/#progress). [Custom easings](http://VelocityJS.org/#easing). ["Finish" command](http://VelocityJS.org/#finish).
- **[1.0](https://github.com/julianshapiro/velocity/compare/0.1.0...1.0.0)**: File name changed to `velocity.js`. Read [VelocityJS.org/#dependencies](http://VelocityJS.org/#dependencies).
- **0.1**: `stop` now stops animations *immediately* (instead of only clearing the remainder of the animation queue). No other backwards-incompatible changes were made.

## Learn
- **Motion design**: [smashingmagazine.com/2014/06/18/faster-ui-animations-with-velocity-js](http://smashingmagazine.com/2014/06/18/faster-ui-animations-with-velocity-js)
- **Animating without jQuery**: [smashingmagazine.com/2014/09/04/animating-without-jquery](http://www.smashingmagazine.com/2014/09/04/animating-without-jquery/)
- **Performance comparisons**: [davidwalsh.name/css-js-animation](http://davidwalsh.name/css-js-animation)
- **Workflow**: [css-tricks.com/improving-ui-animation-workflow-velocity-js](http://css-tricks.com/improving-ui-animation-workflow-velocity-js)

## Comparisons
- **CSS transitions** are meant for simple interface flourishes.
- **jQuery's $.animate()** is slow and poorly-equipped for motion design.
- **Velocity** is a fast, feature-rich standalone alternative to jQuery's $.animate().

====

[MIT License](LICENSE.md). © Julian Shapiro (http://twitter.com/shapiro).<br>
[Stripe](https://stripe.com/blog/stripe-open-source-retreat) sponsors Velocity's development.<br>
[BrowserStack](http://www.browserstack.com/) provides testing services.
