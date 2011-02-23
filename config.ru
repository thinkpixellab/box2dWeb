require 'rubygems'
require 'bundler'
Bundler.setup

require 'rack-rewrite'
require 'rack/contrib'

use Rack::Static
use Rack::StaticCache, :urls => ['/js', '/styles.css']
use Rack::Rewrite do
  rewrite /\/.*/, '/index.html'
end
run Rack::Directory.new(Dir.pwd)
