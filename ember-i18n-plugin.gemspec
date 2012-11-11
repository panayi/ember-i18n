# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'ember-i18n/version'

Gem::Specification.new do |gem|
  gem.name          = "ember-i18n"
  gem.version       = Emberi18n::VERSION
  gem.authors       = ["panayi"]
  gem.email         = ["panayi1954@gmail.com"]
  gem.description   = %q{Instant Website Translator plugin for client side translating page text}
  gem.summary       = %q{Instant Website Translator plugin for client side translating page text}
  gem.homepage      = ""

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]

  gem.add_dependency "railties", "~> 3.1"
end
