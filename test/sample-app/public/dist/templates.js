module.exports = function (Handlebars) {
var template = Handlebars.template, templates = {};
templates['partials/css'] = template({"1":function(depth0,helpers,partials,data) {
    return "  <link href=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\" media=\"all\" rel=\"stylesheet\" type=\"text/css\" />\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options;

  stack1 = ((helper = (helper = helpers.css || (depth0 != null ? depth0.css : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"css","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0,options) : helper));
  if (!helpers.css) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"useData":true});
templates['partials/header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<header>\n  <h1>"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n</header>";
},"useData":true});
templates['partials/kitten'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "partials/kitten";
},"useData":true});
templates['layouts/website/website'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "\n"
    + ((stack1 = this.invokePartial(partials['partials/header'],depth0,{"name":"partials/header","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\n<main>\n"
    + ((stack1 = ((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"main","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n</main>\n\n<footer>\n  Counter: "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.cookie : depth0)) != null ? stack1.counter : stack1), depth0))
    + "\n</footer>\n";
},"usePartial":true,"useData":true});
templates['pages/home/home'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<h2>home.html</h2>\n\n<dl>\n  <dt>now:</dt>\n  <dd>"
    + this.escapeExpression(((helper = (helper = helpers.now || (depth0 != null ? depth0.now : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"now","hash":{},"data":data}) : helper)))
    + "</dd>\n</dl>\n\n"
    + ((stack1 = this.invokePartial(partials['pages/home/kitten'],depth0,{"name":"pages/home/kitten","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = this.invokePartial(partials['partials/kitten'],depth0,{"name":"partials/kitten","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['pages/home/kitten'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "pages/home/kitten";
},"useData":true});
templates['node_modules/bleh/layouts/html5/html5'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <link href=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\" media=\"all\" rel=\"stylesheet\" type=\"text/css\" />\n";
},"3":function(depth0,helpers,partials,data) {
    return "    <script type=\"text/javascript\" src=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></script>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=helpers.helperMissing, alias2="function", alias3=helpers.blockHelperMissing, buffer = 
  "<html>\n  <head>\n    <title>"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</title>\n";
  stack1 = ((helper = (helper = helpers.css || (depth0 != null ? depth0.css : depth0)) != null ? helper : alias1),(options={"name":"css","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.css) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </head>\n  <body>\n\n"
    + ((stack1 = ((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"main","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n";
  stack1 = ((helper = (helper = helpers.js || (depth0 != null ? depth0.js : depth0)) != null ? helper : alias1),(options={"name":"js","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data}),(typeof helper === alias2 ? helper.call(depth0,options) : helper));
  if (!helpers.js) { stack1 = alias3.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </body>\n</html>";
},"useData":true});
return templates;
}